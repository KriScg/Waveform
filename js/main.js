var WIDTH 				= 600, 
	HEIGHT 				= 600,
	TILE_W 				= 36,
	TILE_H 				= 36,
	NODE_NUM_X 			= 8,
	NODE_NUM_Y 			= 8,
	GRID_OFF_X			= TILE_W * 5,
	GRID_OFF_Y			= TILE_H * 2,
	SUBCYCLE_NUM		= 50,
	SUBCYCLE_STABLE_NUM	= 25,
	CYCLE_NUM			= 20,
	c 					= document.getElementById('c'), 
	ctx 				= c.getContext('2d');			
	c.width 			= WIDTH;
	c.height 			= HEIGHT;
var gNodeArray 			= [];
var gGateArray			= [];
var gPins				= [];
var gSimulator			= { cycle:0, subCycle:0, score:0 };
var gCurrLevelID		= 0;
var gUnlockedLevelID 	= 0;
var gStateToColor 		= [ '#0000FF', '#FF0000', '#FF00FF' ];
var gLastVerRes			= -1;
var SHADOW_COLOR		= '#888888';

var GameStateEnum =
{
	DESIGN		: 0,
	DEBUG 		: 1,
	VERIFY 		: 2,
	END_LEVEL	: 3,
	QUESTION	: 4,
	MAIN_MENU	: 5
}
var gGameState			= GameStateEnum.MAIN_MENU;
var gToolboxState		= 0;
var gToolboxStateMax	= 0;

var gHUDButtons	= [];
for ( var i = 0; i < 4; ++i )
{
	var texts	= [ 'VERIFY', 'STEP', 'STOP', 'MENU' ];
	var btnW 	= 75;
	var btnH 	= 30;
	var btnX 	= 150 + i * ( btnW + 4 );
	var btnY 	= 380;
	gHUDButtons.push( { posX:btnX, posY:btnY, width:btnW, height:btnH, text:texts[ i ], textOffX:25 } );	
}
gHUDButtons[ 3 ].textOffX	= null;
gHUDButtons[ 3 ].width		= 60;
gHUDButtons[ 3 ].posX		= 530;
gHUDButtons[ 3 ].posY		= 560;

var gToolButtons = [];
for ( var i = 0; i < 5; ++i )
{
	var texts	= [ '1 PATH', '2 NOT', '3 OR', '4 AND', '5 CROSS' ];
	var btnW 	= 60;
	var btnH 	= 60;
	var btnX 	= 530 + 0.5;
	var btnY 	= 20 + i * ( btnH + 4 ) + 0.5;
	gToolButtons.push( { posX:btnX, posY:btnY, width:btnW, height:btnH, text:texts[ i ] } );
}

var gEndLevelButtons = [];
gEndLevelButtons.push( { posX:210, posY:340, width:80, height:30, text:'NEXT' } );
gEndLevelButtons.push( { posX:310, posY:340, width:80, height:30, text:'RESTART' } );

var gQuestionButtons =[];
gQuestionButtons.push( { posX:210, posY:340, width:80, height:30, text:'YES' } );
gQuestionButtons.push( { posX:310, posY:340, width:80, height:30, text:'NO' } );

var gMainMenuButtons = [];
for ( var i = 0; i < gLevels.length; ++i )
{ 
	var btnW 	= 120;
	var btnH 	= 40;
	var offset	= 10;
	var offsetX = btnW + offset;
	var offsetY = btnH + offset;
	gMainMenuButtons.push( { posX:115 + ( i % 3 ) * offsetX, posY:210 + Math.floor( i / 3 ) * offsetY, width:btnW, height:btnH, text:gLevels[ i ].name, textOffX:22 } );
}

var SimulateReset = function()
{
	gSimulator.cycle 		= 0;
	gSimulator.score		= 0;
	gSimulator.subCycle 	= 0;
	gLastVerRes				= -1;
	
	var pinArrLen = gPins.length;
	for ( var iPin = 0; iPin < pinArrLen; ++iPin )
	{
		var pin = gPins[ iPin ];
		if ( pin.simWaveform )
		{
			pin.simWaveform.length = 0;
		}
	}

	var arrLen = gNodeArray.length;
	for ( var i = 0; i < arrLen; ++i )
	{
		gNodeArray[ i ].connDownState 	= 0;
		gNodeArray[ i ].connRightState 	= 0;
		gNodeArray[ i ].state			= 0;
	}
}

var SelectTool = function( toolID )
{
	gToolboxState = Math.min( toolID, gToolboxStateMax );
}

var LoadLevel = function( levelID )
{
	gCurrLevelID = levelID;
	var level = gLevels[ levelID ];
		
	gGameState			= GameStateEnum.DESIGN;
	gPins 				= level.pins;
	gGateArray.length 	= 0;
	gToolboxStateMax	= level.toolboxStateMax;

	for ( var y = 0; y < NODE_NUM_Y; ++y )
	{
		for ( var x = 0; x < NODE_NUM_X; ++x )
		{
			var i = x + y * NODE_NUM_X;
			var enabledNode = level.nodes[ i ] != 0;
			gNodeArray[ i ] = { enabled:enabledNode, connDown:false, connRight:false, connDownState:0, connRightState:0, state:0 };
		}
	}

	SimulateReset();
	SelectTool( 0 );
}

var gVerifyLoop;
var Verify = function()
{
	if ( gGameState == GameStateEnum.VERIFY )
	{
		if ( gSimulator.cycle < CYCLE_NUM )
		{
			SimulateCycle();
			gVerifyLoop = setTimeout( Verify, 200 );
		}
		else
		{
			gGameState = GameStateEnum.DESIGN;
			if ( gSimulator.score == 100 )
			{
				gLastVerRes = 1;
				gUnlockedLevelID = Math.max( gUnlockedLevelID, gCurrLevelID + 1 );
				gGameState = GameStateEnum.END_LEVEL;
				//localStorage.setItem( 'UnlockedLevelID', gUnlockedLevelID.toString() );
			}
			else
			{
				gLastVerRes = 0;
			}
		}
		
		DrawGame();
	}
}

var SimulateCycle = function()
{
	//gSimulator.cycle = 0;
	gSimulator.subCycle = 0;
	for ( var i = 0; i < SUBCYCLE_NUM; ++i )
	{
		SimulateSubCycle();
		++gSimulator.subCycle;
	}

	// update outputs
	var entryNum		= 0;
	var correctEntryNum	= 0;	
	var pinArrLen 		= gPins.length;
	for ( var iPin = 0; iPin < pinArrLen; ++iPin )
	{
		var pin = gPins[ iPin ];
		if ( pin.simWaveform )
		{
			pin.simWaveform.push( gNodeArray[ pin.nodeX + pin.nodeY * NODE_NUM_X ].state );
			
			for ( var i = 0; i < pin.simWaveform.length; ++i )
			{
				++entryNum;
				if ( pin.simWaveform[ i ] == pin.waveform[ i ] )
				{
					++correctEntryNum;
				}
			}			
		}
	}

	gSimulator.cycle += 1;
	gSimulator.score = Math.round( ( correctEntryNum * 100 ) / entryNum );
}

var EvaluateGateState = function( gate )
{
	var truthTable = [ 
		// NOT
		[ 	1, 0, 2,
			0, 0, 2,
			2, 2, 2 ],
		// OR
		[ 	0, 1, 2,
			1, 1, 1,
			2, 1, 2 ],
		// AND
		[ 	0, 0, 0,
			0, 1, 2,
			0, 2, 2 ] ];

	var stateA = gNodeArray[ gate.srcNodeA ].state;
	var stateB = gNodeArray[ gate.srcNodeB ].state;			
	var newState = truthTable[ gate.type ][ stateA + stateB * 3 ];
	return newState;
}

var PushSignal = function( startNodeID, state )
{
	var dirtyNodes = [ startNodeID ];
	
	while ( dirtyNodes.length > 0 )
	{
		var nodeID = dirtyNodes[ 0 ];
		dirtyNodes.shift();
		gNodeArray[ nodeID ].state = state;

		// right
		if ( gNodeArray[ nodeID ].connRight && gNodeArray[ nodeID ].state != gNodeArray[ nodeID + 1 ].state )
		{
			gNodeArray[ nodeID ].connRightState = state;
			dirtyNodes.push( nodeID + 1 );
		}
		
		// down
		if ( gNodeArray[ nodeID ].connDown && gNodeArray[ nodeID ].state != gNodeArray[ nodeID + NODE_NUM_X ].state )
		{
			gNodeArray[ nodeID ].connDownState = state;
			dirtyNodes.push( nodeID + NODE_NUM_X );
		}

		// left
		if ( nodeID > 0 && gNodeArray[ nodeID - 1 ].connRight && gNodeArray[ nodeID ].state != gNodeArray[ nodeID - 1 ].state )
		{
			gNodeArray[ nodeID - 1 ].connRightState = state;
			dirtyNodes.push( nodeID - 1 );
		}

		// up
		if ( nodeID >= NODE_NUM_X && gNodeArray[ nodeID - NODE_NUM_X ].connDown && gNodeArray[ nodeID ].state != gNodeArray[ nodeID - NODE_NUM_X ].state )
		{
			gNodeArray[ nodeID - NODE_NUM_X ].connDownState = state;			
			dirtyNodes.push( nodeID - NODE_NUM_X );
		}
		
		var gateArrLen = gGateArray.length;
		for ( var j = 0; j < gateArrLen; ++j )
		{
			var gate = gGateArray[ j ];
			if ( gate.type == GateTypeEnum.CROSS )
			{
				if ( gate.srcNodeA == nodeID && gNodeArray[ gate.dstNodeB ].state != state )
				{
					dirtyNodes.push( gate.dstNodeB );
				}
				else if ( gate.srcNodeB == nodeID && gNodeArray[ gate.dstNodeA ].state != state )
				{
					dirtyNodes.push( gate.dstNodeA );
				}
				else if ( gate.dstNodeA == nodeID && gNodeArray[ gate.srcNodeB ].state != state )
				{
					dirtyNodes.push( gate.srcNodeB );
				}
				else if ( gate.dstNodeB == nodeID && gNodeArray[ gate.srcNodeA ].state != state )
				{
					dirtyNodes.push( gate.srcNodeA );
				}
			}
		}
	}
}

var ChangeNodeState = function( newState, dstNodeID )
{
	if ( dstNodeID != -1 && gNodeArray[ dstNodeID ].state != newState )
	{
		if ( gSimulator.subCycle >= SUBCYCLE_STABLE_NUM )
		{
			newState = 2;
		}
		
		PushSignal( dstNodeID, newState );
	}
}

var SimulateSubCycle = function()
{
	// inject inputs
	if ( gSimulator.subCycle == 0 )
	{
		var pinArrLen = gPins.length;
		for ( var iPin = 0; iPin < pinArrLen; ++iPin )
		{
			var pin = gPins[ iPin ];
			if ( !pin.simWaveform )
			{
				var inputNodeID = pin.nodeX + pin.nodeY * NODE_NUM_X;
				ChangeNodeState( pin.waveform[ gSimulator.cycle ], inputNodeID );			
			}
		}
	}

	var gateArrLen = gGateArray.length;
	for ( var j = 0; j < gateArrLen; ++j )
	{
		var gate = gGateArray[ j ];
		if ( gate.type != GateTypeEnum.CROSS )
		{
			var newState = EvaluateGateState( gate );
			ChangeNodeState( newState, gate.dstNodeA );
			ChangeNodeState( newState, gate.dstNodeB );
		}
	}

	gSimulator.currSubcycle += 1;
}

var Clear = function()
{
	ctx.clearRect( 0, 0, WIDTH, HEIGHT );
}

var DrawPin = function( pin )
{
	ctx.strokeStyle		= '#FFDD00';
	ctx.fillStyle		= 'black';
	ctx.font			= '12px Arial';
	ctx.textAlign 		= pin.simWaveform ? 'left' : 'right';
	ctx.textBaseline	= 'middle';
	ctx.lineWidth		= 2;
	
	var offX = pin.simWaveform ? 38 : -39;
	ctx.fillText( pin.name, GRID_OFF_X + pin.nodeX * TILE_W + offX, GRID_OFF_Y + pin.nodeY * TILE_H );
	
	ctx.fillStyle = '#FFDD00';
	if ( gGameState == GameStateEnum.DEBUG || gGameState == GameStateEnum.VERIFY )
	{
		ctx.strokeStyle = gStateToColor[ gNodeArray[ pin.nodeX + pin.nodeY * NODE_NUM_X ].state ];
		ctx.fillStyle 	= gStateToColor[ gNodeArray[ pin.nodeX + pin.nodeY * NODE_NUM_X ].state ];;
	}
	
	offX = pin.simWaveform ? 35 : -35;
	ctx.beginPath();
	ctx.moveTo( GRID_OFF_X + pin.nodeX * TILE_W + offX, GRID_OFF_Y + pin.nodeY * TILE_H );
	ctx.lineTo( GRID_OFF_X + pin.nodeX * TILE_W, GRID_OFF_Y + pin.nodeY * TILE_H );
	ctx.stroke();
	
	offX = pin.simWaveform ? 36 : -5;
	ctx.beginPath();
	ctx.moveTo( GRID_OFF_X + pin.nodeX * TILE_W + offX, GRID_OFF_Y + pin.nodeY * TILE_H );
	ctx.lineTo( GRID_OFF_X + pin.nodeX * TILE_W - 6 + offX, GRID_OFF_Y + pin.nodeY * TILE_H - 6 );
	ctx.lineTo( GRID_OFF_X + pin.nodeX * TILE_W - 6 + offX, GRID_OFF_Y + pin.nodeY * TILE_H + 6 );
	ctx.closePath();
	
	ctx.fill();
}

var DrawDesign = function()
{
	DrawGrid();
	DrawBList( gLevels[ gCurrLevelID ].bList, 2, 10, 2, SHADOW_COLOR, SHADOW_COLOR );
	DrawBList( gLevels[ gCurrLevelID ].bList, 0, 10, 2, 'black', '#89C1B1' );
	
	// draw cross markers
	ctx.lineWidth	= 1;
	ctx.strokeStyle	= '#75A596'
	ctx.beginPath();	
	for ( var y = 0; y < NODE_NUM_Y; ++y )
	{
		for ( var x = 0; x < NODE_NUM_X; ++x )
		{
			if ( gNodeArray[ x + y * NODE_NUM_X ].enabled )
			{
				var size = 8;

				ctx.moveTo( GRID_OFF_X + x * TILE_W + 0.5, GRID_OFF_Y + y * TILE_H - size + 0.5 );
				ctx.lineTo( GRID_OFF_X + x * TILE_W + 0.5, GRID_OFF_Y + y * TILE_H + size + 0.5 );

				ctx.moveTo( GRID_OFF_X + x * TILE_W - size + 0.5, GRID_OFF_Y + y * TILE_H + 0.5 );
				ctx.lineTo( GRID_OFF_X + x * TILE_W + size + 0.5, GRID_OFF_Y + y * TILE_H + 0.5 );
			}
		}
	}
	ctx.stroke();	
	
	var pinArrLen = gPins.length;
	for ( var iPin = 0; iPin < pinArrLen; ++iPin )
	{
		DrawPin( gPins[ iPin ] );
	}

	// draw connections
	ctx.strokeStyle = '#FFDD00';
	ctx.lineWidth 	= 4;
	for ( var y = 0; y < NODE_NUM_Y; ++y )
	{
		for ( var x = 0; x < NODE_NUM_X; ++x )
		{
			if ( gNodeArray[ x + y * NODE_NUM_X ].enabled && gNodeArray[ x + y * NODE_NUM_X ].connRight )
			{
				if ( gGameState == GameStateEnum.DEBUG || gGameState == GameStateEnum.VERIFY )
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
				if ( gGameState == GameStateEnum.DEBUG || gGameState == GameStateEnum.VERIFY )
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
		DrawGate( gGateArray[ i ].type, gGateArray[ i ].nodeX, gGateArray[ i ].nodeY )
	}

	// draw nodes
	ctx.strokeStyle = '#FFDD00';
	ctx.fillStyle 	= 'green';
	ctx.lineWidth 	= 2;
	for ( var y = 0; y < NODE_NUM_Y; ++y )
	{
		for ( var x = 0; x < NODE_NUM_X; ++x )
		{
			if ( gNodeArray[ x + y * NODE_NUM_X ].enabled )
			{
				if ( gGameState == GameStateEnum.DEBUG || gGameState == GameStateEnum.VERIFY )
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
	ctx.fillStyle 		= '#000000';
	ctx.font			= '12px Arial';
	ctx.textAlign 		= 'right';
	ctx.textBaseline	= 'middle';
	ctx.fillText( text, posX - 5, posY + height * 0.5 );

	ctx.strokeStyle	= overlay ? '#888888' : '#000000';
	ctx.lineWidth	= 2;
	ctx.lineCap		= 'round'
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
	var posY 	= 434;
	var width 	= 16;
	var height 	= 16;
	
	ctx.strokeStyle = 'black';
	ctx.fillStyle = '#F2FADF';	
	ctx.beginPath();
	ctx.rect( 0, 370, 600, 600 - 370 );
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	if ( gSimulator.cycle > 0 )
	{
		ctx.fillStyle	= '#D2D8C3';
		ctx.lineWidth	= 3;
		ctx.beginPath();
		ctx.rect( posX + ( gSimulator.cycle - 1 ) * width + 0.5, posY + 0.5 - 10, width, height * 2 * gPins.length + 6 );
		ctx.fill();
	}	

	ctx.strokeStyle	= 'gray';
	ctx.lineWidth	= 1;
	ctx.beginPath();
	for ( var i = 0; i < CYCLE_NUM + 1; ++i )
	{
		ctx.moveTo( posX + i * width + 0.5, posY + 0.5 - 10 );
		ctx.lineTo( posX + i * width + 0.5, posY + height * 2 * gPins.length + 0.5 - 5 );
	}

	for ( var i = 1; i < gPins.length; ++i )
	{
		ctx.moveTo( posX - 50, posY + 0.5 - 2 + i * height * 2 - height * 0.5 );
		ctx.lineTo( posX + 20 * width + 0.5, posY + 0.5 - 2 + i * height * 2 - height * 0.5 );
	}
	ctx.stroke();
	
	var pinArrLen = gPins.length;
	for ( var iPin = 0; iPin < pinArrLen; ++iPin )
	{
		var pin = gPins[ iPin ];
		if ( pin.simWaveform )
		{
			DrawWaveform( posX, posY, width, height, pin.name, pin.waveform, true );
			DrawWaveform( posX, posY, width, height, pin.name, pin.simWaveform );
		}
		else
		{
			DrawWaveform( posX, posY, width, height, pin.name, pin.waveform );
		}
		posY += height * 2.0;
	}
	
	ctx.fillStyle 	= 'black';
	ctx.font 		= '12px Arial';
	ctx.textAlign 	= 'left';

	if ( gGameState == GameStateEnum.VERIFY )
	{
		ctx.fillText( 'VERIFYING (cycle: ' + gSimulator.cycle + '/20 correctness: ' + gSimulator.score + '%)', posX, posY + 10 );
	}
	else if ( gGameState == GameStateEnum.DEBUG )
	{
		ctx.fillText( 'DEBUGGING (cycle: ' + gSimulator.cycle + '/20 correctness: ' + gSimulator.score + '%)', posX, posY + 10 );
	}
	else if ( gLastVerRes == 0 )
	{
		ctx.fillStyle = 'red';
		ctx.fillText( 'VERIFICATION FAILED (correctness: ' + gSimulator.score + '%)', posX, posY + 10 );
	}
	else if ( gLastVerRes == 1 )
	{
		ctx.fillStyle = 'green';
		ctx.fillText( 'VERIFICATION PASSED', posX, posY + 10 );
	}
};

var DrawToolbox = function()
{
	var len = gToolButtons.length;
	for ( var i = 0; i < len; ++i )
	{
		if ( gToolboxStateMax >= i )
		{
			DrawButton( gToolButtons[ i ], i == gToolboxState, false, 3 );
		}
	}
}

var DrawHUD = function()
{
	var len = gHUDButtons.length;
	for ( var i = 0; i < len; ++i )
	{
		DrawButton( gHUDButtons[ i ], false, false, 2 );
		
		switch ( i )
		{
			case 0: DrawRunIcon( gHUDButtons[ i ].posX + 7, gHUDButtons[ i ].posY + 8 ); break;
			case 1: DrawStepIcon( gHUDButtons[ i ].posX + 7, gHUDButtons[ i ].posY + 8 ); break;			
			case 2: DrawStopIcon( gHUDButtons[ i ].posX + 7, gHUDButtons[ i ].posY + 8 ); break;
		}
	}
	
	ctx.font		= '12px Arial';
	ctx.fillStyle 	= 'black';
	ctx.textAlign 	= 'left';	
	ctx.fillText( gLevels[ gCurrLevelID ].name, 3, 11 );
}

var DrawDesc = function()
{	
	var x = 405;
	var y = 390;	
	
	DrawRoundedRect( x - 10 + 0.5, y - 17 + 0.5, 200, 180, 5, 1, '#665A51', '#F2FADF' );
	
	var maxWidth = 190;
	var lineHeight = 20;	
	var hintString = gCurrHintID == -1 ? gLevels[ gCurrLevelID ].desc : gHints[ gCurrHintID ];
	var words = hintString.split(' ');
	var line = '';

	ctx.font 			= '12px Arial';
	ctx.fillStyle 		= 'black';
	ctx.textAlign 		= 'left';
	ctx.textBaseline 	= 'middle';	
	for ( var n = 0; n < words.length; ++n ) 
	{
		var testLine = line + words[ n ] + ' ';
		var metrics = ctx.measureText( testLine );
		var testWidth = metrics.width;
		if ( testWidth > maxWidth ) 
		{
			ctx.fillText( line, x, y );
			line = words[ n ] + ' ';
			y += lineHeight;
		}
		else 
		{
			line = testLine;
		}
	}
	ctx.fillText( line, x, y );
	
	// draw hint
	// ctx.fillText( "Use to connect two nodes", 10, 350 );
}

var DrawWindow = function( endLevel )
{
	var windowW = 250;
	var windowH = 170;
	
	ctx.globalAlpha = 0.4;
	ctx.fillStyle 	= 'black';
	ctx.rect( 0, 0, WIDTH, HEIGHT );
	ctx.fill();	
	ctx.globalAlpha = 1.0;

	DrawRoundedRect( ( WIDTH - windowW ) * 0.5, ( HEIGHT - windowH ) * 0.5, windowW, windowH, 5, 2, 'black', '#F2FACF' );
	
	ctx.font			= '18px Arial';
	ctx.fillStyle		= 'black';
	ctx.textAlign		= 'center';	
	ctx.textBaseline	= 'middle';
	
	if ( gGameState == GameStateEnum.END_LEVEL )
	{
		ctx.fillText( gLevels[ gCurrLevelID ].name, WIDTH * 0.5, HEIGHT * 0.5 - 50 );
		ctx.fillText( 'Design completed!', WIDTH * 0.5, HEIGHT * 0.5 - 20 );
		
		var len = gEndLevelButtons.length;
		for ( var i = 0; i < len; ++i )
		{
			DrawButton( gEndLevelButtons[ i ], false, false, 2 );
		}		
	}
	else
	{
		ctx.fillText( 'Return to main menu?', WIDTH * 0.5, HEIGHT * 0.5 - 30 );
		var len = gQuestionButtons.length;
		for ( var i = 0; i < len; ++i )
		{
			DrawButton( gQuestionButtons[ i ], false, false, 2 );
		}		
	}
}

var DrawMainMenu = function()
{
	DrawGrid();
	DrawRoundedRect( 100 + 2, 155 + 2, 410, 310, 5, 2, SHADOW_COLOR, SHADOW_COLOR );	
	DrawRoundedRect( 100, 155, 410, 310, 5, 2, 'black', '#89C1B1' );
	
	ctx.font			= 'bold 60px Arial';
	ctx.textAlign 		= 'center';	
	ctx.textBaseline 	= 'middle';
	ctx.fillStyle 		= SHADOW_COLOR;	
	ctx.fillText( 'WAVEFORM', WIDTH * 0.5 + 5 + 2, 120 + 2 );
	ctx.fillStyle 		= 'black';
	ctx.fillText( 'WAVEFORM', WIDTH * 0.5 + 5, 120 );
	
	ctx.font = 'bold 14px Arial';
	ctx.fillText( 'SELECT LEVEL', WIDTH * 0.5, 170 );
	ctx.fillText( 'COMPLETED: ' + gUnlockedLevelID + '/' + gLevels.length, WIDTH * 0.5, 190 );
	
	var len = gMainMenuButtons.length;
	for ( var i = 0; i < len; ++i )
	{
		DrawButton( gMainMenuButtons[ i ], false, i > gUnlockedLevelID, 2 );
		if ( i < gUnlockedLevelID )
		{
			DrawDoneIcon( gMainMenuButtons[ i ].posX + 12, gMainMenuButtons[ i ].posY + gMainMenuButtons[ i ].height * 0.6 );
		}
	}	
}

var OnEdgeMouseDown = function( nodeX, nodeY, right )
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
			gGateArray.push( { type:GateTypeEnum.NOT, srcNodeA:nodeID, srcNodeB:nodeID, dstNodeA:nodeID+1, dstNodeB:-1, nodeX:nodeX, nodeY:nodeY } );
			gNodeArray[ nodeID ].connRight = false;
		}
	}
}

var OnTileMouseDown = function( tileX, tileY )
{
	var tileID = tileX + tileY * NODE_NUM_X;
	if ( gToolboxState >= 2 && gToolboxState <= 4 )
	{
		if ( tileX >= 0 && tileY >= 0 && tileX + 1 < NODE_NUM_X && tileY + 1 < NODE_NUM_Y )
		if ( gNodeArray[ tileID ].enabled && gNodeArray[ tileID + 1 ].enabled && gNodeArray[ tileID + NODE_NUM_X ].enabled && gNodeArray[ tileID + NODE_NUM_X + 1 ].enabled )
		{
			var newGateType	= GateTypeEnum.OR + gToolboxState - 2;
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
				gGateArray.push( { type:newGateType, srcNodeA:tileID, srcNodeB:tileID+NODE_NUM_X, dstNodeA:tileID+1, dstNodeB:tileID+1+NODE_NUM_X, nodeX:tileX, nodeY:tileY } );

				gNodeArray[ tileID ].connDown = false;
				gNodeArray[ tileID ].connRight = false;
				gNodeArray[ tileID + 1 ].connDown = false;
				gNodeArray[ tileID + NODE_NUM_X ].connRight	= false;
			}
		}
	}
}

var OnButtonMouseDown = function( button, mousePosX, mousePosY )
{
	return mousePosX >= button.posX && mousePosX <= button.posX + button.width && mousePosY >= button.posY && mousePosY <= button.posY + button.height;
}

document.onkeydown = function( e )
{	
	if ( e.keyCode >= 49 && e.keyCode <= 58 )
	{
		SelectTool( e.keyCode - 49 )
	}
	else if ( e.keyCode >= 97 && e.keyCode <= 105 )
	{
		SelectTool( e.keyCode - 97 )
	}
	else if ( e.keyCode == 87 && gCurrLevelID + 1 < gLevels.length )
	{
		// tempshit debug
		LoadLevel( gCurrLevelID + 1 );
	}
	else if ( e.keyCode == 81 && gCurrLevelID > 0 )
	{
		// tempshit debug
		LoadLevel( gCurrLevelID - 1 );
	}	
	
	
	DrawGame();
}

var gCurrHintID = -1;
var gHints =
[
	'PATH - use it to connect or disconnect adjacent nodes (horizontally or vertically). Keyboard shortcut - "1".',
	'NOT - use it to negate signal. Can be placed only horizontally. Keyboard shortcut - "2".',
	'OR - produces HI signal if any of it\'s inputs are HI. Keyboard shortcut - "3".',
	'AND - It produces HI signal only if both inputs are HI. Keyboard shortcut - "4".',
	'CROSS - allows to intesect signal paths. Keyboard shortcut - "5".',
	'VERIFY - use to test the design and finish level if it\s 100% correct.',
	'STEP - use to debug the design by stepping one cycle and analyzing signal flow.',
	'STOP - use to stop debugging or verification.',
]

c.onmousemove = function( e )
{
	var mousePosX = e.pageX - c.offsetLeft;
	var mousePosY = e.pageY - c.offsetTop;

	var hintID = -1;

	var len = gToolButtons.length;
	for ( var i = 0; i < len; ++i )
	{
		if ( gToolboxStateMax >= i && OnButtonMouseDown( gToolButtons[ i ], mousePosX, mousePosY ) )
		{
			hintID = i;
		}
	}
	
	var len = gHUDButtons.length;
	for ( var i = 0; i < len; ++i )
	{
		if ( OnButtonMouseDown( gHUDButtons[ i ], mousePosX, mousePosY ) )
		{
			hintID = i + 5;
		}
	}
	
	if ( gGameState != GameStateEnum.DEBUG && gGameState != GameStateEnum.DESIGN && gGameState != GameStateEnum.VERIFY )
	{
		hintID = -1;
	}
	
	if ( gCurrHintID != hintID && hintID < gHints.length )
	{
		gCurrHintID = hintID;
		DrawGame();
	}
}

c.onmousedown = function( e )
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
		//console.log( 'mousePos:', mousePosX, mousePosY, 'tile:', tileX, tileY, 'tileSubPos:', tileSubPosX, tileSubPosY );

		if ( gGameState == GameStateEnum.DESIGN || gGameState == GameStateEnum.DEBUG )
		{
			// gates
			OnTileMouseDown( tileX, tileY );
		
			// connectors
			if ( tileSubPosX > tileSubPosY && tileSubPosX < 1 - tileSubPosY )
			{
				OnEdgeMouseDown( tileX, tileY, true );
			}
			else if ( tileSubPosX < tileSubPosY && tileSubPosX > 1 - tileSubPosY )
			{
				OnEdgeMouseDown( tileX, tileY + 1, true );
			}
			else if ( tileSubPosX < tileSubPosY && tileSubPosX < 1 - tileSubPosY )
			{
				OnEdgeMouseDown( tileX, tileY, false );	
			}
			else
			{
				OnEdgeMouseDown( tileX + 1, tileY, false );
			}
					
			var len = gToolButtons.length;
			for ( var i = 0; i < len; ++i )
			{
				if ( OnButtonMouseDown( gToolButtons[ i ], mousePosX, mousePosY ) )
				{
					SelectTool( i );
				}
			}
		}
		
		if ( gGameState == GameStateEnum.DESIGN || gGameState == GameStateEnum.DEBUG || gGameState == GameStateEnum.VERIFY )
		{
			// hud buttons
			var len = gHUDButtons.length;
			for ( var i = 0; i < len; ++i )
			{
				if ( OnButtonMouseDown( gHUDButtons[ i ], mousePosX, mousePosY ) )
				{
					switch ( i )
					{
						case 0:
							if ( gGameState != GameStateEnum.VERIFY )
							{
								gGameState = GameStateEnum.VERIFY;						
								SimulateReset();
								Verify();
							}
							break;

						case 1:
							if ( gSimulator.cycle < CYCLE_NUM )
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
							gGameState = GameStateEnum.QUESTION;
							break;							
					}
				}
			}
		}
		else if ( gGameState == GameStateEnum.END_LEVEL )
		{
			var len = gEndLevelButtons.length;
			for ( var i = 0; i < len; ++i )
			{
				if ( OnButtonMouseDown( gEndLevelButtons[ i ], mousePosX, mousePosY ) )
				{
					switch ( i )
					{
						case 0:
							if ( gCurrLevelID + 1 < gLevels.length )
							{
								LoadLevel( gCurrLevelID + 1 );
							}
							else
							{
								gGameState = GameStateEnum.MAIN_MENU;
							}
							break;
							
						case 1:
							LoadLevel( gCurrLevelID );
							break;							
					}
				}
			}
		}
		else if ( gGameState == GameStateEnum.QUESTION )
		{
			var len = gQuestionButtons.length;
			for ( var i = 0; i < len; ++i )
			{
				if ( OnButtonMouseDown( gQuestionButtons[ i ], mousePosX, mousePosY ) )
				{
					switch ( i )
					{
						case 0:
							gGameState = GameStateEnum.MAIN_MENU;
							break;

						case 1:
							gGameState = GameStateEnum.DESIGN;
							break;
					}
				}
			}
		}
		else if ( gGameState == GameStateEnum.MAIN_MENU )
		{		
			var len = gMainMenuButtons.length;
			for ( var i = 0; i < len; ++i )
			{
				if ( OnButtonMouseDown( gMainMenuButtons[ i ], mousePosX, mousePosY ) && i <= gUnlockedLevelID )
				{
					LoadLevel( i );
					break;
				}
			}
		}	
	}
	
	DrawGame();
}

var InitGame = function()
{
	var value = localStorage.getItem( 'UnlockedLevelID' );
	if ( value )
	{
		gUnlockedLevelID = parseInt( value );
	}
	LoadLevel( 0 );
	gGameState = GameStateEnum.MAIN_MENU;
}

var DrawGame = function()
{
	Clear();

	if ( gGameState == GameStateEnum.MAIN_MENU )
	{
		DrawMainMenu();
	}
	else
	{
		DrawDesign();	
		DrawTestBench();
		DrawToolbox();
		DrawHUD();
		DrawDesc();
	}

	if ( gGameState == GameStateEnum.END_LEVEL || gGameState == GameStateEnum.QUESTION )
	{
		DrawWindow();
	}
}

InitGame();
DrawGame();