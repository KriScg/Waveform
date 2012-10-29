var WIDTH 		= 640, 
	HEIGHT 		= 480,
	TILE_W 		= 32,
	TILE_H 		= 32,
	TILE_NUM_X 	= 10,
	TILE_NUM_Y 	= 10,
	CONN_NUM_X	= TILE_NUM_X - 1,
	CONN_NUM_Y	= TILE_NUM_Y - 1,
	GRID_OFF_X	= 32,
	GRID_OFF_Y	= 32,
	gLoop,
	c 			= document.getElementById('c'), 
	ctx 		= c.getContext('2d');			
	c.width 	= WIDTH;
	c.height 	= HEIGHT;
var gMousePosX = 0;
var gMousePosY = 0;
var gConnectionArray = new Array( 1, 1, 1, 1 );

var Simulate = function()
{
	gConnectionArray[ 0 ] = 1;
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
	for ( var y = 0; y < CONN_NUM_Y; ++y )
	{
		for ( var x = 0; x < CONN_NUM_X; ++x )
		{
			if ( gConnectionArray[ x + y * CONN_NUM_X ] == 1 )
			{
				ctx.beginPath();
				ctx.moveTo( GRID_OFF_X + x * TILE_W, GRID_OFF_Y + y * TILE_H );
				ctx.lineTo( GRID_OFF_X + ( x + 1.0 ) * TILE_W, GRID_OFF_Y + y* TILE_H );
				ctx.stroke();
			}
		}
	}

	ctx.fillStyle 	= 'green';
	ctx.strokeStyle = '#FFDD00';	
	ctx.lineWidth 	= 2;
	for ( var y = 0; y < TILE_NUM_Y; ++y )
	{
		for ( var x = 0; x < TILE_NUM_X; ++x )
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
		//console.log( gMousePosX );
		
		var tileX = Math.floor( ( gMousePosX - GRID_OFF_X ) / TILE_W );
		var tileY = Math.floor( ( gMousePosY - GRID_OFF_Y + 0.5 * TILE_H ) / TILE_H );
		
		if ( tileX >= 0 && tileY >= 0 && tileX < TILE_NUM_X && tileY < TILE_NUM_Y )
		{
			gConnectionArray[ tileX + tileY * CONN_NUM_X ] = !gConnectionArray[ tileX + tileY * CONN_NUM_X ];
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