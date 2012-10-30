var WIDTH 		= 640, 
	HEIGHT 		= 480,
	TILE_W 		= 32,
	TILE_H 		= 32,
	NODE_NUM_X 	= 10,
	NODE_NUM_Y 	= 10,
	GRID_OFF_X	= 0,
	GRID_OFF_Y	= 0,
	gLoop,
	c 			= document.getElementById('c'), 
	ctx 		= c.getContext('2d');			
	c.width 	= WIDTH;
	c.height 	= HEIGHT;
var gMousePosX = 0;
var gMousePosY = 0;
var gNodeArray = new Array();

for ( var i = 0; i < NODE_NUM_X * NODE_NUM_Y; ++i )
{
	var node = new Object()
	node.enabled 	= true;
	node.connDown	= false;
	node.connRight	= false;
	gNodeArray[ i ] = node;
}


var Simulate = function()
{
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

var DrawGrid = function()
{
	ctx.strokeStyle = '#FFDD00';
	ctx.lineWidth 	= 4;
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
	var testWave = new Array( 0, 1, 0, 1, 1, 1, 0, 1, 0 );
	var posX 	= 20;
	var posY 	= 400;
	var width 	= 16;
	var height 	= 16;
	
	ctx.fillStyle = 'black';
	ctx.font = '10px Arial';
	ctx.textAlign = 'center';
	ctx.fillText( "WAVEFORMS:", posX + 30, posY - 10 );
	ctx.fillText( "1", posX - 5, posY + 5 );
	ctx.fillText( "0", posX - 5, posY + height + 5 );
	
	ctx.strokeStyle = 'green';
	ctx.lineWidth = 2;
	ctx.beginPath();	
	for ( var i = 0; i < testWave.length; ++i )
	{
		ctx.moveTo( posX + i * width, posY + ( testWave[ i ] == 0 ? height : 0 ) );
		ctx.lineTo( posX + ( i + 1 ) * width, posY + ( testWave[ i ] == 0 ? height : 0 ) );
		
		if ( i + 1 < testWave.length && testWave[ i ] != testWave[ i + 1 ] )
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
	
		console.log( "mousePos:", gMousePosX, gMousePosY, "tile:", tileX, tileY, "tileSubPos:", tileSubPosX, tileSubPosY );

		if ( tileSubPosX > tileSubPosY && tileSubPosX < 1 - tileSubPosY )
		{
			gNodeArray[ tileX + tileY * NODE_NUM_X ].connRight = !gNodeArray[ tileX + tileY * NODE_NUM_X ].connRight;
		}
		else if ( tileSubPosX < tileSubPosY && tileSubPosX > 1 - tileSubPosY )
		{
			gNodeArray[ tileX + ( tileY + 1 ) * NODE_NUM_X ].connRight = !gNodeArray[ tileX + ( tileY + 1 ) * NODE_NUM_X ].connRight;
		}
		else if ( tileSubPosX < tileSubPosY && tileSubPosX < 1 - tileSubPosY )
		{
			gNodeArray[ tileX + tileY * NODE_NUM_X ].connDown = !gNodeArray[ tileX + tileY * NODE_NUM_X ].connDown;
		}
		else
		{
			gNodeArray[ tileX + 1 + tileY * NODE_NUM_X ].connDown = !gNodeArray[ tileX + 1 + tileY * NODE_NUM_X ].connDown;
		}
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