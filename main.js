var WIDTH 			= 600, 
	HEIGHT 			= 600,
	TILE_W 			= 36,
	TILE_H 			= 36,
	NODE_NUM_X 		= 10,
	NODE_NUM_Y 		= 10,
	GRID_OFF_X		= 30,
	GRID_OFF_Y		= 30,
	gLoop,
	c 				= document.getElementById('c'), 
	ctx 			= c.getContext('2d');			
	c.width 		= WIDTH;
	c.height 		= HEIGHT;
var gNodeArray 		= new Array();
var gGateArray		= new Array();
var gCurrCycle 		= 0;
var gWaveform  		= new Array();
var gWaveformInputA = new Array( 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0 );
var gWaveformInputB = new Array( 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0 );
var gWaveformInputC = new Array( 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1 );
var gWaveformOutput = new Array( 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 );
var gDirtyNodeArray	= new Array();
var gButtonArray	= new Array();

var GateTypeEnum =
{
	NOT	: 0,
	AND	: 1,
	OR	: 2
}

for ( var i = 0; i < NODE_NUM_X * NODE_NUM_Y; ++i )
{
	gNodeArray[ i ] = { enabled:true, connDown:false, connRight:false, connDownState:0, connRightState:0, state:0 };
}

gButtonArray.push( { posX:300, posY:380, width:30, height:30, text:"verify" } );
gButtonArray.push( { posX:330, posY:380, width:30, height:30, text:"abc" } );
gButtonArray.push( { posX:500, posY:10, width:30, height:30, text:"NOT" } );
gGateArray.push( { type:GateTypeEnum.OR, srcNodeA:1, srcNodeB:11, dstNodeA:2, dstNodeB:12, nodeX:1, nodeY:0, rotation:0 } );


var Simulate = function()
{
	// inputs
	gNodeArray[ 0 ].state = 1;
	gDirtyNodeArray.push( 0 );

	var dirtyNodeArrLen = gDirtyNodeArray.length;
	for ( var i = 0; i < dirtyNodeArrLen; ++i )
	{
		var nodeID = gDirtyNodeArray[ i ];
		
		// right
		if ( gNodeArray[ nodeID ].connRight )
		{
			if ( gNodeArray[ nodeID + 1 ].state != gNodeArray[ nodeID ].state )
			{
				gNodeArray[ nodeID + 1 ].state = gNodeArray[ nodeID ].state;
				gNodeArray[ nodeID ].connRightState = gNodeArray[ nodeID ].state;
				gDirtyNodeArray.push( nodeID + 1 );
			}
		}
		
		// down
		if ( gNodeArray[ nodeID ].connDown )
		{
			if ( gNodeArray[ nodeID + NODE_NUM_X ].state != gNodeArray[ nodeID ].state )
			{
				gNodeArray[ nodeID + NODE_NUM_X ].state = gNodeArray[ nodeID ].state;
				gNodeArray[ nodeID ].connDownState = gNodeArray[ nodeID ].state;
				gDirtyNodeArray.push( nodeID + NODE_NUM_X );
			}
		}
		
		// left
		if ( nodeID > 0 && gNodeArray[ nodeID - 1 ].connRight )
		{
			if ( gNodeArray[ nodeID - 1 ].state != gNodeArray[ nodeID ].state )
			{		
				gNodeArray[ nodeID - 1 ].state = gNodeArray[ nodeID ].state;
				gNodeArray[ nodeID - 1 ].connRightState = gNodeArray[ nodeID ].state;
				gDirtyNodeArray.push( nodeID - 1 )
			}
		}
		
		// up
		if ( nodeID > NODE_NUM_X && gNodeArray[ nodeID - NODE_NUM_X ].connDown )
		{
			if ( gNodeArray[ nodeID - NODE_NUM_X ].state != gNodeArray[ nodeID ].state )
			{
				gNodeArray[ nodeID - NODE_NUM_X ].state = gNodeArray[ nodeID ].state;
				gNodeArray[ nodeID - NODE_NUM_X ].connDownState = gNodeArray[ nodeID ].state;
				gDirtyNodeArray.push( nodeID - NODE_NUM_X )			
			}
		}
		
		// gates
		var gateArrLen = gGateArray.length;
		for ( var j = 0; j < gateArrLen; ++j )
		{
			var gate = gGateArray[ j ];
			if ( gate.srcNodeA == nodeID || gate.srcNodeB == nodeID )
			{
				var newState 	= 0;
				var stateA 		= gNodeArray[ gate.srcNodeA ].state;
				var stateB 		= gNodeArray[ gate.srcNodeB ].state;
				
				switch ( gate.type )
				{
					case GateTypeEnum.NOT: 	newState = stateA == 1 ? 0 : 1;	break;
					case GateTypeEnum.AND: 	newState = stateA == 1 && stateB == 1 ? 1 : 0; break;
					case GateTypeEnum.OR: 	newState = stateA == 1 || stateB == 1 ? 1 : 0; break;
				}

				if ( gNodeArray[ gate.dstNodeA ].state != newState )
				{
					gNodeArray[ gate.dstNodeA ].state = newState;
					gDirtyNodeArray.push( gate.dstNodeA );
				}
				
				if ( gNodeArray[ gate.dstNodeB ].state != newState )
				{
					gNodeArray[ gate.dstNodeB ].state = newState;
					gDirtyNodeArray.push( gate.dstNodeB );
				}				
			}
		}
	}
	gDirtyNodeArray = gDirtyNodeArray.slice( dirtyNodeArrLen );

	gWaveform.push( gNodeArray[ 2 ].state );
	gCurrCycle += 1;	
	console.log( gDirtyNodeArray.length )
}

var Clear = function()
{
	ctx.clearRect( 0, 0, WIDTH, HEIGHT );

	ctx.fillStyle = '#8ECCBC';	
	ctx.beginPath();
	ctx.rect( 0, 0, WIDTH, HEIGHT );
	ctx.closePath();
	ctx.fill();
}

var DrawGrid = function()
{
	ctx.strokeStyle = '#FFDD00';
	ctx.lineWidth 	= 3;
	for ( var y = 0; y < NODE_NUM_Y; ++y )
	{
		for ( var x = 0; x < NODE_NUM_X; ++x )
		{
			if ( gNodeArray[ x + y * NODE_NUM_X ] && gNodeArray[ x + y * NODE_NUM_X ].connRight )
			{
				if ( gNodeArray[ x + y * NODE_NUM_X ].connRightState == 0 )
					ctx.strokeStyle = '#FFDD00';
				else
					ctx.strokeStyle = '#FF0000';

				//ctx.save();
				//ctx.shadowColor = '#999';
				//ctx.shadowBlur = 10;
				//ctx.shadowOffsetX = 3;
				//ctx.shadowOffsetY = 3;
				ctx.beginPath();
				ctx.moveTo( GRID_OFF_X + x * TILE_W, GRID_OFF_Y + y * TILE_H );
				ctx.lineTo( GRID_OFF_X + ( x + 1 ) * TILE_W, GRID_OFF_Y + y * TILE_H );
				ctx.stroke();
				//ctx.fill();
				//ctx.shadowOffsetX = 0;
				//ctx.shadowOffsetY = 0;	
				//ctx.restore();
			}
			
			if ( gNodeArray[ x + y * NODE_NUM_X ] && gNodeArray[ x + y * NODE_NUM_X ].connDown )
			{
				if ( gNodeArray[ x + y * NODE_NUM_X ].connDownState == 0 )
					ctx.strokeStyle = '#FFDD00';
				else
					ctx.strokeStyle = '#FF0000';
			
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
			if ( gNodeArray[ x + y * NODE_NUM_X ].state == 0 )
				ctx.strokeStyle = '#FFDD00';
			else
				ctx.strokeStyle = '#FF0000';
		
		    ctx.beginPath();
			ctx.arc( GRID_OFF_X + x * TILE_W, GRID_OFF_Y + y * TILE_H, 4, 0, 2 * Math.PI, false );
			ctx.fill();
			ctx.stroke();
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
		ctx.moveTo( posX + i * width, posY + ( waveform[ i ] ? 0 : height ) );
		ctx.lineTo( posX + ( i + 1 ) * width, posY + ( waveform[ i ] ? 0 : height ) );
		
		if ( i + 1 < waveform.length && waveform[ i ] != waveform[ i + 1 ] )
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
	var posY 	= 420;
	var width 	= 16;
	var height 	= 16;
	
	ctx.fillStyle = 'black';
	ctx.font = '10px Arial';
	ctx.textAlign = 'left';
	ctx.fillText( "WAVEFORMS Cycle: " + gCurrCycle.toString() + "/20", posX, posY - 10 );
	ctx.textAlign = 'center';	
	
	DrawWaveform( posX, posY, width, height, "InputA", gWaveformInputA );
	DrawWaveform( posX, posY + height * 2.5, width, height, "InputB", gWaveformInputB );
	DrawWaveform( posX, posY + height * 5, width, height, "InputC", gWaveformInputC );
	DrawWaveform( posX, posY + height * 7.5, width, height, "Output", gWaveformOutput, true );	
	DrawWaveform( posX, posY + height * 7.5, width, height, "Output", gWaveform );
};

var DrawHUD = function()
{
	var posX 	= 460;
	var posY 	= 40;
	var entryW 	= 20;

	ctx.fillStyle = 'black';
	ctx.font = '10px Arial';
	ctx.textAlign = 'center';
	ctx.fillText( "ERASE", posX, posY );
	ctx.fillStyle = 'red';
	ctx.fillText( "CONNECT", posX, posY + entryW );
	ctx.fillStyle = 'black';
	ctx.fillText( "OR", posX, posY + entryW * 2 );
	ctx.fillText( "AND", posX, posY + entryW * 3 );
	ctx.fillText( "MUX2x1", posX, posY + entryW * 4 );
	ctx.fillText( "CLOCK", posX, posY + entryW * 5 );
	
	ctx.fillText( "STEP", posX, posY + entryW * 6 );
	
	
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
	ctx.fillStyle = '#F2FACF';
	ctx.beginPath();
	ctx.arc( 550, 440, 150, 0, 2 * Math.PI, false );
	ctx.fill();
	
	ctx.font 		= '10px Arial';
	ctx.fillStyle 	= 'black';	
	ctx.textAlign 	= 'center';	
	ctx.fillText( ".01 - POWER ON", 530, 400 );
	ctx.fillText( "Route power from @clk to @out", 530, 420 );
};

var SwitchConnector = function( nodeX, nodeY, right )
{
	if ( nodeX >= 0 && nodeY >= 0 && nodeX < NODE_NUM_X && nodeY < NODE_NUM_Y )
	if ( nodeX + 1 < NODE_NUM_X || !right )
	if ( nodeY + 1 < NODE_NUM_X || right )	
	{
		if ( right )
		{
			gNodeArray[ nodeX + nodeY * NODE_NUM_X ].connRight = !gNodeArray[ nodeX + nodeY * NODE_NUM_X ].connRight;
		}
		else
		{
			gNodeArray[ nodeX + nodeY * NODE_NUM_X ].connDown = !gNodeArray[ nodeX + nodeY * NODE_NUM_X ].connDown;
		}
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
				if ( i == 0 )
				{
					Simulate();	
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