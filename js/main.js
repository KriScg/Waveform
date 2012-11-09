var WIDTH 			= 600, 
	HEIGHT 			= 600,
	TILE_W 			= 36,
	TILE_H 			= 36,
	NODE_NUM_X 		= 10,
	NODE_NUM_Y 		= 10,
	GRID_OFF_X		= 140,
	GRID_OFF_Y		= 10,
	SUBCYCLE_NUM	= 20,
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
//var gStateToColor 	= new Array( "#FFDD00", "#FF0000", "#FF00FF" );
var gStateToColor 	= new Array( "#0000FF", "#FF0000", "#FF00FF" );

gButtonArray.push( { posX:300, posY:385, width:30, height:30, text:"verify" } );
gButtonArray.push( { posX:330, posY:385, width:30, height:30, text:"step" } );
gButtonArray.push( { posX:360, posY:385, width:30, height:30, text:"stop" } );

var SimulateReset = function()
{
	gSimulator.cycle 			= 0;
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
	
	gOutput 			= level.output;
	gInputsArray 		= level.inputs;
	gGateArray.length 	= 0;

	for ( var y = 0; y < NODE_NUM_Y; ++y )
	{
		for ( var x = 0; x < NODE_NUM_X; ++x )
		{
			var i = x + y * NODE_NUM_X;
			var enabledNode = level.nodes[ i ] != 0;
			gNodeArray[ i ] = { enabled:enabledNode, connDownPossible:enabledNode, connRightPossible:enabledNode, connDown:false, connRight:false, connDownState:2, connRightState:2, state:2, constState:-1 };		
		}
	}
	
	for ( var y = 0; y < NODE_NUM_Y; ++y )
	{
		for ( var x = 0; x < NODE_NUM_X; ++x )
		{
			var i = x + y * NODE_NUM_X;
			
			if ( x == NODE_NUM_X - 1 || !gNodeArray[ i + 1 ].enabled )
			{
				gNodeArray[ i ].connRightPossible = false;
			}
			
			if ( y == NODE_NUM_Y - 1 || !gNodeArray[ i + NODE_NUM_X ].enabled )
			{
				gNodeArray[ i ].connDownPossible = false;
			}

			if ( level.nodes[ i ] == 2 )
			{
				gGateArray.push( { type:GateTypeEnum.NOT, srcNodeA:i, srcNodeB:-1, dstNodeA:i+1, dstNodeB:-1, nodeX:x, nodeY:y, rotation:0 } );
				gNodeArray[ i ].connRightPossible = false;
			}

			if ( level.nodes[ i ] == 3 )
			{
				gGateArray.push( { type:GateTypeEnum.OR, srcNodeA:i, srcNodeB:i+NODE_NUM_X, dstNodeA:i+1, dstNodeB:i+1+NODE_NUM_X, nodeX:x, nodeY:y, rotation:0 } );
				gNodeArray[ i ].connRightPossible = false;
				gNodeArray[ i ].connDownPossible = false;
				gNodeArray[ i + NODE_NUM_X ].connRightPossible = false;
				gNodeArray[ i + 1 ].connDownPossible = false;
			}	
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
	if ( gSimulator.cycle >= gOutput.waveform.length )
	{
		return;
	}

	for ( var i = 0; i < SUBCYCLE_NUM; ++i )
	{
		gSimulator.subCycle = i;
		SimulateSubCycle()
	}

	// outputs
	gSimulator.waveform.push( gNodeArray[ gOutput.nodeX + gOutput.nodeY * NODE_NUM_X ].state );
	gSimulator.cycle += 1;
	console.log( gDirtyNodeArray.length )
}

var WriteState = function( srcNodeID, dstNodeID )
{
	if ( gNodeArray[ dstNodeID ].state != gNodeArray[ srcNodeID ].state )
	{
		gDirtyNodeArray.push( { currID:dstNodeID, prevID:srcNodeID } );
		gNodeArray[ dstNodeID ].state = gNodeArray[ srcNodeID ].state;
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

	// check constState violations	
	var dirtyNodeArrLen = gDirtyNodeArray.length;
	for ( var i = 0; i < dirtyNodeArrLen; ++i )
	{
		var nodeID 		= gDirtyNodeArray[ i ].currID;		
		if ( gNodeArray[ nodeID ].constState >= 0 && gNodeArray[ nodeID ].state != gNodeArray[ nodeID ].constState )
		{
			gNodeArray[ nodeID ].state 	= 2;
			gDirtyNodeArray[ i ].prevID	= -1;
		}
	}

	// nodes
	for ( var i = 0; i < dirtyNodeArrLen; ++i )
	{
		var nodeID 		= gDirtyNodeArray[ i ].currID;
		var prevNodeID 	= gDirtyNodeArray[ i ].prevID;

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

				if ( gate.dstNodeA != -1 && gNodeArray[ gate.dstNodeA ].state != newState )
				{
					gNodeArray[ gate.dstNodeA ].state 		= newState;
					gNodeArray[ gate.dstNodeA ].constState 	= newState;
					gDirtyNodeArray.push( { currID:gate.dstNodeA, prevID:-1 } );
				}
				
				if ( gate.dstNodeB != -1 && gNodeArray[ gate.dstNodeB ].state != newState )
				{
					gNodeArray[ gate.dstNodeB ].state 		= newState;
					gNodeArray[ gate.dstNodeA ].constState 	= newState;
					gDirtyNodeArray.push( { currID:gate.dstNodeB, prevID:-1 } );
				}
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
				ctx.strokeStyle = gStateToColor[ gNodeArray[ x + y * NODE_NUM_X ].connRightState ];
				ctx.beginPath();
				ctx.moveTo( GRID_OFF_X + x * TILE_W, GRID_OFF_Y + y * TILE_H );
				ctx.lineTo( GRID_OFF_X + ( x + 1 ) * TILE_W, GRID_OFF_Y + y * TILE_H );
				ctx.stroke();
			}
			
			if ( gNodeArray[ x + y * NODE_NUM_X ].enabled && gNodeArray[ x + y * NODE_NUM_X ].connDown )
			{
				ctx.strokeStyle = gStateToColor[ gNodeArray[ x + y * NODE_NUM_X ].connDownState ];
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

	ctx.fillStyle 	= 'green';
	ctx.lineWidth 	= 2;
	for ( var y = 0; y < NODE_NUM_Y; ++y )
	{
		for ( var x = 0; x < NODE_NUM_X; ++x )
		{
			if ( gNodeArray[ x + y * NODE_NUM_X ].enabled )
			{
				ctx.strokeStyle = gStateToColor[ gNodeArray[ x + y * NODE_NUM_X ].state ];
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
	ctx.fillText( text, posX - 30, posY + height * 0.5 );
	ctx.fillText( "1", posX - 5, posY );
	ctx.fillText( "0", posX - 5, posY + height );
	ctx.strokeStyle = overlay ? '#888888' : '#000000';
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
	
	ctx.strokeStyle = 'black';
	ctx.fillStyle = '#F2FADF';	
	ctx.beginPath();
	ctx.rect( 0, 370, 600, 600 - 370 );
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.fillStyle = 'black';
	ctx.font = '10px Arial';
	ctx.textAlign = 'left';
	ctx.fillText( "WAVEFORMS Cycle: " + gSimulator.cycle.toString() + "/20", posX, posY - 20 );
	ctx.textAlign = 'center';	
	
	ctx.strokeStyle = 'gray';
	ctx.lineWidth = 1;
	for ( var i = 0; i < gOutput.waveform.length + 1; ++i )
	{
		ctx.moveTo( posX + i * width + 0.5, posY + 0.5 - 2 );
		ctx.lineTo( posX + i * width + 0.5, posY + height * 8 + 0.5 );
	}
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

		ctx.strokeStyle = 'black';
		ctx.textAlign = 'center';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.rect( button.posX, button.posY, button.width, button.height );
		ctx.closePath();
		ctx.stroke();	
		ctx.fillText( button.text, button.posX + button.width * 0.5, button.posY + button.height * 0.5 );
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

var SwitchConnector = function( nodeX, nodeY, right )
{
	if ( nodeX >= 0 && nodeY >= 0 && nodeX < NODE_NUM_X && nodeY < NODE_NUM_Y )
	if ( nodeX + 1 < NODE_NUM_X || !right )
	if ( nodeY + 1 < NODE_NUM_X || right )
	{
		if ( right && gNodeArray[ nodeX + nodeY * NODE_NUM_X ].connRightPossible )
		{
			gNodeArray[ nodeX + nodeY * NODE_NUM_X ].connRight = !gNodeArray[ nodeX + nodeY * NODE_NUM_X ].connRight;
		}
		else if ( !right && gNodeArray[ nodeX + nodeY * NODE_NUM_X ].connDownPossible )
		{
			gNodeArray[ nodeX + nodeY * NODE_NUM_X ].connDown = !gNodeArray[ nodeX + nodeY * NODE_NUM_X ].connDown;
		}
	}
}

document.onkeydown = function( e )
{
	// tempshit debug stuff
	switch ( e.keyCode )
	{
		case 97: InitLevel( 0 ); break;
		case 98: InitLevel( 1 ); break;
		case 99: InitLevel( 2 ); break;
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
		/*
		var gateArrLen = gGateArray.length;
		for ( var i = 0; i < gateArrLen; ++i )
		{
			var gate = gGateArray[ i ];
			if ( tileX == gate.nodeX && tileY == gate.nodeY )
			{
				var tmp = gate.srcNodeA;
				gate.srcNodeA = gate.dstNodeA;
				gate.dstNodeA = gate.dstNodeB;
				gate.dstNodeB = gate.srcNodeB;
				gate.srcNodeB = tmp;
				gate.rotation += 0.5 * Math.PI;
				return;
			}
		}
		*/
	
		// connectors
		if ( tileSubPosX > tileSubPosY && tileSubPosX < 1 - tileSubPosY )
		{
			SwitchConnector( tileX, tileY, true );
		}
		else if ( tileSubPosX < tileSubPosY && tileSubPosX > 1 - tileSubPosY )
		{
			SwitchConnector( tileX, tileY + 1, true );
		}
		else if ( tileSubPosX < tileSubPosY && tileSubPosX < 1 - tileSubPosY )
		{
			SwitchConnector( tileX, tileY, false );	
		}
		else
		{
			SwitchConnector( tileX + 1, tileY, false );
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
					case 0: Simulate(); break;
					case 1: SimulateCycle(); break;
					case 2: SimulateReset(); break;
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