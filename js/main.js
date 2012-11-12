var WIDTH 				= 600, 
	HEIGHT 				= 600,
	TILE_W 				= 36,
	TILE_H 				= 36,
	NODE_NUM_X 			= 10,
	NODE_NUM_Y 			= 10,
	GRID_OFF_X			= 140,
	GRID_OFF_Y			= 10,
	SUBCYCLE_NUM		= 40,
	SUBCYCLE_STABLE_NUM	= 20,
	gLoop,
	c 				= document.getElementById('c'), 
	ctx 			= c.getContext('2d');			
	c.width 		= WIDTH;
	c.height 		= HEIGHT;
var gNodeArray 		= new Array();
var gGateArray		= new Array();
var gDirtyNodeArray	= new Array();
var gButtonArray	= new Array();
var gInputsArray 	= new Array();
var gOutput;
var gSimulator		= { cycle:0, subCycle:0, waveform:new Array() };
var gCurrLevelID	= 0;
var gStateToColor 	= new Array( "#0000FF", "#FF0000", "#FF00FF" );

var GameStateEnum =
{
	DESIGN		: 0,
	DEBUG 		: 1
}
var gGameState		= GameStateEnum.DESIGN;
var gToolboxState	= 0;

gButtonArray.push( { posX:300, posY:385, width:30, height:30, text:"verify", focus:false } );
gButtonArray.push( { posX:330, posY:385, width:30, height:30, text:"step", focus:false } );
gButtonArray.push( { posX:360, posY:385, width:30, height:30, text:"stop", focus:false } );

gButtonArray.push( { posX:550, posY:20, width:30, height:30, text:"Node", focus:true } );
gButtonArray.push( { posX:550, posY:51, width:30, height:30, text:"NOT", focus:false } );
gButtonArray.push( { posX:550, posY:82, width:30, height:30, text:"OR", focus:false } );
gButtonArray.push( { posX:550, posY:113, width:30, height:30, text:"AND", focus:false } );

var SimulateReset = function()
{
	gSimulator.cycle 			= 0;
	gSimulator.score			= 0;
	gSimulator.subCycle 		= 0;
	gSimulator.waveform.length 	= 0;
	gDirtyNodeArray.length		= 0;

	var arrLen = gNodeArray.length;
	for ( var i = 0; i < arrLen; ++i )
	{
		gNodeArray[ i ].connDownState 	= 2;
		gNodeArray[ i ].connRightState 	= 2;
		gNodeArray[ i ].state			= 2;
		gNodeArray[ i ].constState		= -1;
	}
}

var InitLevel = function( levelID )
{
	gCurrLevelID = levelID;
	var level = gLevels[ levelID ];
	
	gGameState			= GameStateEnum.DESIGN;
	gOutput 			= level.output;
	gInputsArray 		= level.inputs;
	gGateArray.length 	= 0;

	for ( var y = 0; y < NODE_NUM_Y; ++y )
	{
		for ( var x = 0; x < NODE_NUM_X; ++x )
		{
			var i = x + y * NODE_NUM_X;
			var enabledNode = level.nodes[ i ] != 0;
			gNodeArray[ i ] = { enabled:enabledNode, connDown:false, connRight:false, connDownState:2, connRightState:2, state:2, constState:-1 };
		}
	}

	SimulateReset();
}

InitLevel( 0 );

var Simulate = function()
{
	SimulateReset();
	for ( var i = 0; i < gOutput.waveform.length; ++i )
	{
		SimulateCycle();
	}
}

var SimulateCycle = function()
{
	for ( var i = 0; i < SUBCYCLE_NUM; ++i )
	{
		gSimulator.subCycle = i;
		SimulateSubCycle()
	}

	// outputs
	gSimulator.waveform.push( gNodeArray[ gOutput.nodeX + gOutput.nodeY * NODE_NUM_X ].state );
	gSimulator.cycle += 1;
	
	var correctEntryNum = 0;
	for ( var i = 0; i < gSimulator.waveform.length; ++i )
	{
		if ( gSimulator.waveform[ i ] == gOutput.waveform[ i ] )
		{
			++correctEntryNum;
		}
	}
	gSimulator.score = Math.round( ( correctEntryNum * 100 ) / gSimulator.waveform.length );
}

var EvaluateGateState = function( gate )
{
	var newState 	= 0;
	var stateA 		= gate.srcNodeA != -1 ? gNodeArray[ gate.srcNodeA ].state : 2;
	var stateB 		= gate.srcNodeB != -1 ? gNodeArray[ gate.srcNodeB ].state : 2;

	switch ( gate.type )
	{
		case GateTypeEnum.NOT: 	newState = stateA == 1 ? 0 : 1;	break;
		case GateTypeEnum.AND: 	newState = stateA == 1 && stateB == 1 ? 1 : 0; break;
		case GateTypeEnum.OR: 	newState = stateA == 1 || stateB == 1 ? 1 : 0; break;
	}

	if ( stateA == 2 || ( stateB == 2 && gate.type != GateTypeEnum.NOT ) )
	{
		newState = 2;
	}	
	
	return newState;
}

var WriteState = function( srcNodeID, dstNodeID )
{
	if ( gNodeArray[ dstNodeID ].state != gNodeArray[ srcNodeID ].state )
	{
		if ( gSimulator.subCycle < SUBCYCLE_STABLE_NUM )
		{
			gDirtyNodeArray.push( { currID:dstNodeID, prevID:srcNodeID } );
			gNodeArray[ dstNodeID ].state = gNodeArray[ srcNodeID ].state;
		}
		else
		{
			gDirtyNodeArray.push( { currID:dstNodeID, prevID:-1 } );
			gNodeArray[ dstNodeID ].state = 2;
		}
	}
}

var WriteState2 = function( newState, dstNodeID )
{
	if ( dstNodeID != -1 && gNodeArray[ dstNodeID ].state != newState )
	{
		if ( gSimulator.subCycle >= SUBCYCLE_STABLE_NUM )
		{
			newState = 2;
		}
		gNodeArray[ dstNodeID ].state = newState;
		gDirtyNodeArray.push( { currID:dstNodeID, prevID:-1 } );
	}
}

var SimulateSubCycle = function()
{
	// inject inputs
	if ( gSimulator.subCycle == 0 )
	{
		var arrLen = gInputsArray.length;
		for ( var i = 0; i < arrLen; ++i )
		{
			var input = gInputsArray[ i ];
			var inputNodeID = input.nodeX + input.nodeY * NODE_NUM_X;
			if ( gSimulator.subCycle == 0 )
			{
				gNodeArray[ inputNodeID ].state 		= input.waveform[ gSimulator.cycle ];
				gNodeArray[ inputNodeID ].constState 	= input.waveform[ gSimulator.cycle ];
				gDirtyNodeArray.push( { currID:inputNodeID, prevID:-1 } );
			}
		}
	}

	// verify gate conditions
	if ( gSimulator.subCycle == SUBCYCLE_STABLE_NUM )
	{
		var gateArrLen = gGateArray.length;
		for ( var j = 0; j < gateArrLen; ++j )
		{
			var gate = gGateArray[ j ];
			var newState = EvaluateGateState( gate );
			WriteState2( newState, gate.dstNodeA );
			WriteState2( newState, gate.dstNodeB );
		}
	}

	// nodes
	var dirtyNodeArrLen = gDirtyNodeArray.length;	
	for ( var i = 0; i < dirtyNodeArrLen; ++i )
	{
		var nodeID 		= gDirtyNodeArray[ i ].currID;
		var prevNodeID 	= gDirtyNodeArray[ i ].prevID;
		
		if ( gNodeArray[ nodeID ].constState >= 0 && gNodeArray[ nodeID ].state != gNodeArray[ nodeID ].constState )
		{
			gNodeArray[ nodeID ].state = 2;
			prevNodeID = -1;
		}		

		// right
		if ( gNodeArray[ nodeID ].connRight && prevNodeID != nodeID + 1 )
		{
			WriteState( nodeID, nodeID + 1 );
			gNodeArray[ nodeID ].connRightState = gNodeArray[ nodeID ].state;
		}
		
		// down
		if ( gNodeArray[ nodeID ].connDown && prevNodeID != nodeID + NODE_NUM_X )
		{
			WriteState( nodeID, nodeID + NODE_NUM_X );
			gNodeArray[ nodeID ].connDownState = gNodeArray[ nodeID ].state;
		}

		// left
		if ( nodeID > 0 && gNodeArray[ nodeID - 1 ].connRight && prevNodeID != nodeID - 1 )
		{
			WriteState( nodeID, nodeID - 1 );
			gNodeArray[ nodeID - 1 ].connRightState = gNodeArray[ nodeID ].state;			
		}

		// up
		if ( nodeID > NODE_NUM_X && gNodeArray[ nodeID - NODE_NUM_X ].connDown && prevNodeID != nodeID - NODE_NUM_X )
		{
			WriteState( nodeID, nodeID - NODE_NUM_X );
			gNodeArray[ nodeID - NODE_NUM_X ].connDownState = gNodeArray[ nodeID ].state;			
		}

		// gates
		var gateArrLen = gGateArray.length;
		for ( var j = 0; j < gateArrLen; ++j )
		{
			var gate = gGateArray[ j ];
			if ( gate.srcNodeA == nodeID || gate.srcNodeB == nodeID )
			{
				var newState = EvaluateGateState( gate );
				WriteState2( newState, gate.dstNodeA );
				WriteState2( newState, gate.dstNodeB );
			}
		}
	}
	
	gDirtyNodeArray = gDirtyNodeArray.slice( dirtyNodeArrLen );
	gSimulator.currSubcycle += 1;
}

var Clear = function()
{
	ctx.clearRect( 0, 0, WIDTH, HEIGHT );
}

var DrawGrid = function()
{
	ctx.strokeStyle = 'black';
	ctx.fillStyle = '#8ECCBC';	
	ctx.beginPath();
	ctx.rect( 0, 0, WIDTH, GRID_OFF_Y + NODE_NUM_Y * TILE_H );
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	// inputs and outputs
	ctx.strokeStyle = '#FFDD00';
	ctx.fillStyle = 'black';
	ctx.font = '10px Arial';
	ctx.textAlign = 'right';
	ctx.lineWidth = 2;
	
	var arrLen = gInputsArray.length;
	for ( var i = 0; i < arrLen; ++i )
	{
		var input = gInputsArray[ i ];
		ctx.fillText( input.name, GRID_OFF_X - 10 + input.nodeX * TILE_W, GRID_OFF_Y - 6 + input.nodeY * TILE_H );
		ctx.beginPath();
		ctx.moveTo( GRID_OFF_X - 20 + input.nodeX * TILE_W, GRID_OFF_Y + input.nodeY * TILE_H );
		ctx.lineTo( GRID_OFF_X + input.nodeX * TILE_W, GRID_OFF_Y + input.nodeY * TILE_H );
		ctx.stroke();	
	}
	
	ctx.textAlign = 'left';
	ctx.fillText( gOutput.name, GRID_OFF_X + 10 + gOutput.nodeX * TILE_W, GRID_OFF_Y - 6 + gOutput.nodeY * TILE_H );
	ctx.beginPath();
	ctx.moveTo( GRID_OFF_X + 20 + gOutput.nodeX * TILE_W, GRID_OFF_Y + gOutput.nodeY * TILE_H );
	ctx.lineTo( GRID_OFF_X + gOutput.nodeX * TILE_W, GRID_OFF_Y + gOutput.nodeY * TILE_H );
	ctx.stroke();	
	


	ctx.strokeStyle = '#FFDD00';
	ctx.lineWidth 	= 3;
	for ( var y = 0; y < NODE_NUM_Y; ++y )
	{
		for ( var x = 0; x < NODE_NUM_X; ++x )
		{
			if ( gNodeArray[ x + y * NODE_NUM_X ].enabled && gNodeArray[ x + y * NODE_NUM_X ].connRight )
			{
				if ( gGameState == GameStateEnum.DEBUG )
				{
					ctx.strokeStyle = gStateToColor[ gNodeArray[ x + y * NODE_NUM_X ].connRightState ];
				}
				ctx.beginPath();
				ctx.moveTo( GRID_OFF_X + x * TILE_W, GRID_OFF_Y + y * TILE_H );
				ctx.lineTo( GRID_OFF_X + ( x + 1 ) * TILE_W, GRID_OFF_Y + y * TILE_H );
				ctx.stroke();
			}
			
			if ( gNodeArray[ x + y * NODE_NUM_X ].enabled && gNodeArray[ x + y * NODE_NUM_X ].connDown )
			{
				if ( gGameState == GameStateEnum.DEBUG )
				{			
					ctx.strokeStyle = gStateToColor[ gNodeArray[ x + y * NODE_NUM_X ].connDownState ];
				}
				ctx.beginPath();
				ctx.moveTo( GRID_OFF_X + x * TILE_W, GRID_OFF_Y + y * TILE_H );
				ctx.lineTo( GRID_OFF_X + x * TILE_W, GRID_OFF_Y + ( y + 1 ) * TILE_H );
				ctx.stroke();
			}			
		}
	}
	
	// draw gates
	var arrLen = gGateArray.length;
	for ( var i = 0; i < arrLen; ++i )
	{
		DrawGate( gGateArray[ i ].type, gGateArray[ i ].nodeX, gGateArray[ i ].nodeY, gGateArray[ i ].rotation )
	}

	ctx.strokeStyle = '#FFDD00';
	ctx.fillStyle 	= 'green';
	ctx.lineWidth 	= 2;
	for ( var y = 0; y < NODE_NUM_Y; ++y )
	{
		for ( var x = 0; x < NODE_NUM_X; ++x )
		{
			if ( gNodeArray[ x + y * NODE_NUM_X ].enabled )
			{
				if ( gGameState == GameStateEnum.DEBUG )
				{			
					ctx.strokeStyle = gStateToColor[ gNodeArray[ x + y * NODE_NUM_X ].state ];
				}
				ctx.beginPath();
				ctx.arc( GRID_OFF_X + x * TILE_W, GRID_OFF_Y + y * TILE_H, 4, 0, 2 * Math.PI, false );
				ctx.fill();
				ctx.stroke();
			}
		}
	}
};

var DrawWaveform = function( posX, posY, width, height, text, waveform, overlay )
{
	ctx.textAlign = "right";
	ctx.fillText( text, posX - 5, posY + height * 0.5 + 4 );
	ctx.strokeStyle = overlay ? "#777777" : "#0030A0";
	ctx.lineWidth = 2;
	ctx.beginPath();	
	for ( var i = 0; i < waveform.length; ++i )
	{
		if ( waveform[ i ] == 2 )
		{
			ctx.moveTo( posX + i * width, posY );
			ctx.lineTo( posX + ( i + 1 ) * width, posY + height );
			ctx.moveTo( posX + i * width, posY + height );
			ctx.lineTo( posX + ( i + 1 ) * width, posY );
		}
		else
		{
			ctx.moveTo( posX + i * width, posY + ( waveform[ i ] ? 0 : height ) );
			ctx.lineTo( posX + ( i + 1 ) * width, posY + ( waveform[ i ] ? 0 : height ) );
		}

		if ( i + 1 < waveform.length && waveform[ i ] != waveform[ i + 1 ] && waveform[ i ] != 2 && waveform[ i + 1 ] != 2 )
		{
			ctx.moveTo( posX + ( i + 1 ) * width, posY );
			ctx.lineTo( posX + ( i + 1 ) * width, posY + height );
		}
	}
	ctx.stroke();
}

var DrawTestBench = function()
{
	var posX 	= 60;
	var posY 	= 430;
	var width 	= 16;
	var height 	= 16;
	
	ctx.strokeStyle = "black";
	ctx.fillStyle = '#F2FADF';	
	ctx.beginPath();
	ctx.rect( 0, 370, 600, 600 - 370 );
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.fillStyle = 'black';
	ctx.font = '10px Arial';
	ctx.textAlign = "left";
	ctx.fillText( "Cycle: " + gSimulator.cycle.toString() + "/20" + " Corectness: " + gSimulator.score + "%", posX, posY - 20 );
	ctx.textAlign = 'center';	
	
	ctx.strokeStyle = 'gray';
	ctx.lineWidth = 1;
	for ( var i = 0; i < gOutput.waveform.length + 1; ++i )
	{
		ctx.moveTo( posX + i * width + 0.5, posY + 0.5 - 2 );
		ctx.lineTo( posX + i * width + 0.5, posY + height * 8 + 0.5 );
	}
	//ctx.moveTo( posX - 50, posY + 0.5 + 26 );
	//ctx.lineTo( posX + 20 * width + 0.5, posY + 0.5 + 26 );
	//ctx.moveTo( posX - 50, posY + 0.5 + 26 + 40 );
	//ctx.lineTo( posX + 20 * width + 0.5, posY + 0.5 + 26 + 40 );
	ctx.stroke();
	
	var arrLen = gInputsArray.length;
	for ( var i = 0; i < arrLen; ++i )
	{
		var input = gInputsArray[ i ];
		DrawWaveform( posX, posY, width, height, input.name, input.waveform );	
		posY += height * 2.5;
	}

	DrawWaveform( posX, posY, width, height, "Output", gOutput.waveform, true );
	DrawWaveform( posX, posY, width, height, "Output", gSimulator.waveform );
};

var DrawHUD = function()
{	
	// buttons
	var buttonArrLen = gButtonArray.length;
	for ( var i = 0; i < buttonArrLen; ++i )
	{
		var button = gButtonArray[ i ];

		ctx.strokeStyle = button.focus ? 'red' : 'black';
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.rect( button.posX, button.posY, button.width, button.height );
		ctx.closePath();
		ctx.stroke();	
		ctx.fillText( button.text, button.posX + button.width * 0.5, button.posY + button.height * 0.5 );
	}

	ctx.font		= '10px Arial';
	ctx.fillStyle 	= 'black';
	ctx.textAlign 	= 'left';
	if ( gGameState == GameStateEnum.DESIGN )
	{
		ctx.fillText( gLevels[ gCurrLevelID ].name + " - Designing... Tool:" + gToolboxState, 10, 20 );
	} 
	else if ( gGameState == GameStateEnum.DEBUG )
	{
		ctx.fillText( gLevels[ gCurrLevelID ].name + " - Debugging... Tool:" + gToolboxState, 10, 20 );
	}
};

var DrawDesc = function()
{
	ctx.strokeStyle = 'black';
	ctx.fillStyle = '#F2FACF';
	ctx.beginPath();
	ctx.arc( 550, 440, 150, 0, 2 * Math.PI, false );
	ctx.fill();
	ctx.stroke();
	
	ctx.font 		= '10px Arial';
	ctx.fillStyle 	= 'black';	
	ctx.textAlign 	= 'center';	
	ctx.fillText( gLevels[ gCurrLevelID ].name, 530, 400 );
	ctx.fillText( gLevels[ gCurrLevelID ].desc, 530, 420 );
};

var SelectTool = function( toolID )
{
	gButtonArray[ 3 ].focus = false;
	gButtonArray[ 4 ].focus = false;
	gButtonArray[ 5 ].focus = false;
	gButtonArray[ 6 ].focus = false;
	gButtonArray[ toolID + 3 ].focus = true;
	gToolboxState = toolID;
}

var OnEdgeMouseUp = function( nodeX, nodeY, right )
{
	var nodeID = nodeX + nodeY * NODE_NUM_X;

	if ( gToolboxState == 0 || gToolboxState == 1 )
	if ( nodeX >= 0 && nodeY >= 0 && nodeX < NODE_NUM_X && nodeY < NODE_NUM_Y )
	if ( nodeX + 1 < NODE_NUM_X || !right )
	if ( nodeY + 1 < NODE_NUM_Y || right )
	if ( ( right && gNodeArray[ nodeID + 1 ].enabled ) || ( !right && gNodeArray[ nodeID + NODE_NUM_X ].enabled ) )
	{
		var newGateType	= GateTypeEnum.NOT;
		var oldGateType	= null;
		for ( var j = 0; j < gGateArray.length; ++j )
		{
			var gate = gGateArray[ j ];
			if ( right && ( ( gate.nodeX == nodeX && gate.nodeY == nodeY ) || ( gate.nodeX == nodeX && gate.nodeY == nodeY - 1 && gate.type != GateTypeEnum.NOT ) ) )
			{
				gGateArray.splice( j, 1 );
				--j;
				oldGateType = gate.type == GateTypeEnum.NOT ? gate.type : oldGateType;
			}
			else if ( !right && gate.type != GateTypeEnum.NOT && ( ( gate.nodeX == nodeX && gate.nodeY == nodeY ) || ( gate.nodeX == nodeX - 1 && gate.nodeY == nodeY ) ) )
			{
				gGateArray.splice( j, 1 );
				--j;				
			}
		}

		if ( gToolboxState == 0 )
		{
			if ( right )
			{
				gNodeArray[ nodeID ].connRight = !gNodeArray[ nodeID ].connRight;
			}
			else if ( !right )
			{
				gNodeArray[ nodeID ].connDown = !gNodeArray[ nodeID ].connDown;
			}
		}
		else if ( gToolboxState == 1 && right && oldGateType != GateTypeEnum.NOT )
		{
			gGateArray.push( { type:GateTypeEnum.NOT, srcNodeA:nodeID, srcNodeB:-1, dstNodeA:nodeID+1, dstNodeB:-1, nodeX:nodeX, nodeY:nodeY, rotation:0 } );
			gNodeArray[ nodeID ].connRight = false;
		}
	}
}

var OnTileMouseUp = function( tileX, tileY )
{
	var tileID = tileX + tileY * NODE_NUM_X;
	if ( gToolboxState == 2 || gToolboxState == 3 )
	{
		if ( tileX >= 0 && tileY >= 0 && tileX + 1 < NODE_NUM_X && tileY + 1 < NODE_NUM_Y )
		if ( gNodeArray[ tileID ].enabled && gNodeArray[ tileID + 1 ].enabled && gNodeArray[ tileID + NODE_NUM_X ].enabled && gNodeArray[ tileID + NODE_NUM_X + 1 ].enabled )
		{
			var newGateType	= gToolboxState == 2 ? GateTypeEnum.OR : GateTypeEnum.AND;
			var oldGateType	= null;
			for ( var j = 0; j < gGateArray.length; ++j )
			{
				var gate = gGateArray[ j ];
				if ( ( gate.nodeX == tileX && gate.nodeY == tileY ) || ( gate.nodeX == tileX && gate.nodeY == tileY + 1 && gate.type == GateTypeEnum.NOT ) )
				{
					gGateArray.splice( j, 1 );
					--j;
					oldGateType = gate.type != GateTypeEnum.NOT ? gate.type : oldGateType;
				}
			}

			if ( oldGateType != newGateType )
			{
				gGateArray.push( { type:newGateType, srcNodeA:tileID, srcNodeB:tileID+NODE_NUM_X, dstNodeA:tileID+1, dstNodeB:tileID+1+NODE_NUM_X, nodeX:tileX, nodeY:tileY, rotation:0 } );
				gNodeArray[ tileID ].connDown = false;
				gNodeArray[ tileID ].connRight = false;
				gNodeArray[ tileID + 1 ].connDown = false;
				gNodeArray[ tileID + NODE_NUM_X ].connRight	= false;
			}
		}
	}
}

document.onkeydown = function( e )
{
	// tempshit debug stuff
	switch ( e.keyCode )
	{
		case 49: SelectTool( 0 ); break;
		case 50: SelectTool( 1 ); break;
		case 51: SelectTool( 2 ); break;
		case 52: SelectTool( 3 ); break;
		case 97: InitLevel( 0 ); break;
		case 98: InitLevel( 1 ); break;
		case 99: InitLevel( 2 ); break;
		case 100: InitLevel( 3 ); break;
		case 101: InitLevel( 4 ); break;
	}
}

document.onmouseup = function( e )
{
	var mousePosX = e.pageX - c.offsetLeft;
	var mousePosY = e.pageY - c.offsetTop;
	if ( mousePosX >= 0 && mousePosY >= 0 )
	{
		var posX  		= ( mousePosX - GRID_OFF_X ) / TILE_W;
		var posY  		= ( mousePosY - GRID_OFF_Y ) / TILE_H;
		var tileX 		= Math.floor( posX );
		var tileY 		= Math.floor( posY );
		var tileSubPosX = posX - tileX;
		var tileSubPosY = posY - tileY;
		//console.log( "mousePos:", mousePosX, mousePosY, "tile:", tileX, tileY, "tileSubPos:", tileSubPosX, tileSubPosY );		
				
		// gates
		OnTileMouseUp( tileX, tileY );
	
		// connectors
		if ( tileSubPosX > tileSubPosY && tileSubPosX < 1 - tileSubPosY )
		{
			OnEdgeMouseUp( tileX, tileY, true );
		}
		else if ( tileSubPosX < tileSubPosY && tileSubPosX > 1 - tileSubPosY )
		{
			OnEdgeMouseUp( tileX, tileY + 1, true );
		}
		else if ( tileSubPosX < tileSubPosY && tileSubPosX < 1 - tileSubPosY )
		{
			OnEdgeMouseUp( tileX, tileY, false );	
		}
		else
		{
			OnEdgeMouseUp( tileX + 1, tileY, false );
		}
		
		// buttons
		var buttonArrLen = gButtonArray.length;
		for ( var i = 0; i < buttonArrLen; ++i )
		{
			var button = gButtonArray[ i ];
			
			if ( mousePosX >= button.posX && mousePosX <= button.posX + button.width && mousePosY >= button.posY && mousePosY <= button.posY + button.height )
			{
				switch ( i )
				{
					case 0:
						//gGameState = GameStateEnum.VERIFY;
						Simulate(); 
						break;

					case 1:
						if ( gSimulator.cycle < gOutput.waveform.length )
						{
							gGameState = GameStateEnum.DEBUG;
							SimulateCycle();
						}
						break;
						
					case 2: 
						gGameState = GameStateEnum.DESIGN;					
						SimulateReset();
						break;
						
					case 3:
						SelectTool( 0 );
						break;
						
					case 4:
						SelectTool( 1 );
						break;		

					case 5:
						SelectTool( 2 );
						break;
						
					case 6:
						SelectTool( 3 );
						break;						
				}
			}
		}
	}
}

var GameLoop = function()
{
	Clear();
	DrawGrid();	
	DrawTestBench();
	DrawHUD();
	DrawDesc();
	gLoop = setTimeout(GameLoop, 1000 / 50);
}

GameLoop();