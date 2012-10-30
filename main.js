var WIDTH 		= 640, 
	HEIGHT 		= 480,
	TILE_W 		= 36,
	TILE_H 		= 36,
	NODE_NUM_X 	= 10,
	NODE_NUM_Y 	= 10,
	GRID_OFF_X	= 20,
	GRID_OFF_Y	= 20,
	gLoop,
	c 			= document.getElementById('c'), 
	ctx 		= c.getContext('2d');			
	c.width 	= WIDTH;
	c.height 	= HEIGHT;
var gMousePosX = 0;
var gMousePosY = 0;
var gNodeArray = new Array();
var gCurrCycle = 0;
var gWaveform  = new Array();

for ( var i = 0; i < NODE_NUM_X * NODE_NUM_Y; ++i )
{
	var node = new Object()
	node.enabled 	= true;
	node.connDown	= false;
	node.connRight	= false;
	node.state		= 0;
	gNodeArray[ i ] = node;
}


var Simulate = function()
{	
	gCurrCycle += 1;
	gWaveform.push( 1 );
}

var Clear = function()
{
	ctx.fillStyle = '#8ECCBC';
	ctx.clearRect( 0, 0, WIDTH, HEIGHT );
	ctx.beginPath();
	ctx.rect( 0, 0, WIDTH, HEIGHT );
	ctx.closePath();
	ctx.fill();
}

var DrawAND = function( posX, posY )
{
	var size = 10;
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.beginPath();
	
	ctx.arc( posX, posY, size, 1.5 * Math.PI, 0.5 * Math.PI, false );
	
	ctx.moveTo( posX, posY - size );
	ctx.lineTo( posX - size, posY - size );
	ctx.lineTo( posX - size, posY + size );
	ctx.lineTo( posX, posY + size );
	
	// inputs
	ctx.moveTo( posX - size, posY - size * 0.5 );
	ctx.lineTo( posX - 0.5 * TILE_W, posY - size * 0.5 );
	ctx.lineTo( posX - 0.5 * TILE_W, posY - size * 2 );
	ctx.moveTo( posX - size, posY + size * 0.5 );
	ctx.lineTo( posX - 0.5 * TILE_W, posY + size * 0.5 );
	ctx.lineTo( posX - 0.5 * TILE_W, posY + size * 2 );
	
	// outputs
	ctx.moveTo( posX + size, posY );
	ctx.lineTo( posX + 0.5 * TILE_W, posY );
	ctx.lineTo( posX + 0.5 * TILE_W, posY - size * 2 );
	ctx.moveTo( posX + 0.5 * TILE_W, posY );
	ctx.lineTo( posX + 0.5 * TILE_W, posY + size * 2 );
	ctx.stroke();
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
				ctx.beginPath();
				ctx.moveTo( GRID_OFF_X + x * TILE_W, GRID_OFF_Y + y * TILE_H );
				ctx.lineTo( GRID_OFF_X + ( x + 1 ) * TILE_W, GRID_OFF_Y + y * TILE_H );
				ctx.stroke();
			}
			
			if ( gNodeArray[ x + y * NODE_NUM_X ] && gNodeArray[ x + y * NODE_NUM_X ].connDown )
			{
				ctx.beginPath();
				ctx.moveTo( GRID_OFF_X + x * TILE_W, GRID_OFF_Y + y * TILE_H );
				ctx.lineTo( GRID_OFF_X + x * TILE_W, GRID_OFF_Y + ( y + 1 ) * TILE_H );
				ctx.stroke();
			}			
		}
	}
	
	ctx.save();
	ctx.translate( GRID_OFF_X + 0.5 * TILE_W, GRID_OFF_Y + 0.5 * TILE_H );
	ctx.rotate( 0.5 * Math.PI )
	DrawAND( 0, 0 )
	ctx.restore();

	ctx.fillStyle 	= 'green';
	ctx.strokeStyle = '#FFDD00';	
	ctx.lineWidth 	= 2;
	for ( var y = 0; y < NODE_NUM_Y; ++y )
	{
		for ( var x = 0; x < NODE_NUM_X; ++x )
		{
		    ctx.beginPath();
			ctx.arc( GRID_OFF_X + x * TILE_W, GRID_OFF_Y + y * TILE_H, 4, 0, 2 * Math.PI, false );
			ctx.fill();
			ctx.stroke();
		}
	}
};

var DrawWaveform = function()
{
	var posX 	= 20;
	var posY 	= 400;
	var width 	= 16;
	var height 	= 16;
	
	ctx.fillStyle = 'black';
	ctx.font = '10px Arial';
	ctx.textAlign = 'left';
	ctx.fillText( "WAVEFORMS Cycle: " + gCurrCycle.toString() + "/20", posX, posY - 10 );
	ctx.textAlign = 'center';
	ctx.fillText( "1", posX - 5, posY + 5 );
	ctx.fillText( "0", posX - 5, posY + height + 5 );
	
	ctx.strokeStyle = 'green';
	ctx.lineWidth = 2;
	ctx.beginPath();	
	for ( var i = 0; i < gWaveform.length; ++i )
	{
		ctx.moveTo( posX + i * width, posY + ( gWaveform[ i ] ? 0 : height ) );
		ctx.lineTo( posX + ( i + 1 ) * width, posY + ( gWaveform[ i ] ? 0 : height ) );
		
		if ( i + 1 < gWaveform.length && gWaveform[ i ] != gWaveform[ i + 1 ] )
		{
			ctx.moveTo( posX + ( i + 1 ) * width, posY );
			ctx.lineTo( posX + ( i + 1 ) * width, posY + height );
		}
	}
	ctx.stroke();
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

document.onmouseup = function()
{
	if ( gMousePosX >= 0 && gMousePosY >= 0 )
	{		
		var posX  		= ( gMousePosX - GRID_OFF_X ) / TILE_W;
		var posY  		= ( gMousePosY - GRID_OFF_Y ) / TILE_H;
		var tileX 		= Math.floor( posX );
		var tileY 		= Math.floor( posY );
		var tileSubPosX = posX - tileX;
		var tileSubPosY = posY - tileY;
	
		//console.log( "mousePos:", gMousePosX, gMousePosY, "tile:", tileX, tileY, "tileSubPos:", tileSubPosX, tileSubPosY );

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
	}
	else
	{
		Simulate();
	}
}

document.onmousemove = function( e )
{
	gMousePosX = e.pageX - c.offsetLeft;
	gMousePosY = e.pageY - c.offsetTop;
}

var GameLoop = function()
{
	Clear();
	DrawGrid();	
	DrawWaveform();
	DrawHUD();
	DrawDesc();
	gLoop = setTimeout(GameLoop, 1000 / 50);
}

GameLoop();