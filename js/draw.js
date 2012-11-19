var DrawGate = function( type, nodeX, nodeY )
{
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.beginPath();
	
	var posX = GRID_OFF_X + nodeX * TILE_W;
	var posY = GRID_OFF_Y + nodeY * TILE_H;
	switch ( type )
	{
		case GateTypeEnum.NOT:		DrawNOT( posX, posY ); break;
		case GateTypeEnum.AND:		DrawAND( posX, posY );	break;
		case GateTypeEnum.OR:		DrawOR( posX, posY ); 	break;
		case GateTypeEnum.CROSS:	DrawCross( posX, posY ); break;
	}

	ctx.stroke();
}

var DrawGateInputs = function( posX, posY, offX )
{
	var size = 10;
	ctx.moveTo( posX - size + offX, posY - size * 0.5 );
	ctx.lineTo( posX - 0.5 * TILE_W, posY - size * 0.5 );
	ctx.lineTo( posX - 0.5 * TILE_W, posY - size * 2 );
	ctx.moveTo( posX - size + offX, posY + size * 0.5 );
	ctx.lineTo( posX - 0.5 * TILE_W, posY + size * 0.5 );
	ctx.lineTo( posX - 0.5 * TILE_W, posY + size * 2 );
}

var DrawGateOutputs = function( posX, posY )
{
	var size = 10;
	ctx.moveTo( posX + size + 2, posY );
	ctx.lineTo( posX + 0.5 * TILE_W, posY );
	ctx.lineTo( posX + 0.5 * TILE_W, posY - size * 2 );
	ctx.moveTo( posX + 0.5 * TILE_W, posY );
	ctx.lineTo( posX + 0.5 * TILE_W, posY + size * 2 );
}

var DrawAND = function( posX, posY )
{
	posX += TILE_W * 0.5;
	posY += TILE_H * 0.5;

	var size = 10;
	ctx.arc( posX + 1, posY, size, 1.5 * Math.PI, 0.5 * Math.PI, false );
	ctx.moveTo( posX + 1, posY - size );
	ctx.lineTo( posX - size, posY - size );
	ctx.lineTo( posX - size, posY + size );
	ctx.lineTo( posX + 1, posY + size );

	DrawGateInputs( posX, posY, 0 );
	DrawGateOutputs( posX, posY );
}

var DrawNOT = function( posX, posY )
{
	var offX0 	= TILE_W * 0.35;
	var offX1 	= TILE_W * ( 1 - 0.4 );
	var offY 	= TILE_H * 0.20;

	ctx.moveTo( posX, posY );
	ctx.lineTo( posX + offX0, posY );
	ctx.lineTo( posX + offX0, posY + offY );
	ctx.lineTo( posX + offX1, posY );
	ctx.lineTo( posX + offX0, posY - offY );
	ctx.lineTo( posX + offX0, posY );
	ctx.moveTo( posX + offX1, posY );
	ctx.lineTo( posX + TILE_W, posY );
	ctx.arc( posX + offX1 + 2, posY, 2, 0, 2 * Math.PI, false );
}

var DrawOR = function( posX, posY )
{
	posX += TILE_W * 0.5;
	posY += TILE_H * 0.5;
	var size = 10;
	
	ctx.moveTo( posX + 1, posY - size );
	ctx.lineTo( posX - size, posY - size );
	ctx.quadraticCurveTo( posX, posY, posX - size, posY + size )
	ctx.lineTo( posX + 1, posY + size );
	ctx.quadraticCurveTo( posX + 0.75 * size, posY + 0.75 * size, posX + size + 2, posY )
	ctx.quadraticCurveTo( posX + 0.75 * size, posY - 0.75 * size, posX + 1, posY - size )
	
	DrawGateInputs( posX, posY, 4 );
	DrawGateOutputs( posX, posY );
}

var DrawCross = function( posX, posY )
{
	ctx.moveTo( posX, posY );
	ctx.lineTo( posX + TILE_W, posY + TILE_H );

	ctx.moveTo( posX, posY + TILE_H );
	ctx.arc( posX + TILE_W * 0.5, posY + TILE_H * 0.5, TILE_W * 0.15, 0.75 * Math.PI, 1.75 * Math.PI );
	ctx.lineTo( posX + TILE_W, posY );
}

var DrawButton = function( button, focus, disabled )
{
	DrawRoundedRect( button.posX, button.posY, button.width, button.height, 10, 2, focus ? '#FF0000' : '#665A51', disabled ? '#7F6A4F' : '#FCBC5F' );

	ctx.font			= 'bold 12px Arial';
	ctx.textAlign 		= button.textOffX ? 'left' : 'center';
	ctx.textBaseline 	= 'middle';
	ctx.fillStyle 		= disabled ? '#665A51' : '#493C2E'
	ctx.fillText( button.text, button.posX + ( button.textOffX ? button.textOffX : button.width * 0.5 ), button.posY + button.height * 0.5 );		
}

var DrawRoundedRect = function( x, y, width, height, radius, lineWidth, strokeStyle, fillStyle )
{
	ctx.lineWidth	= lineWidth;
	ctx.strokeStyle	= strokeStyle;
	ctx.fillStyle 	= fillStyle;
	ctx.beginPath();
	ctx.moveTo(x+radius,y);
    ctx.arcTo(x+width,y,x+width,y+radius,radius);
	ctx.arcTo(x+width,y+height,x+width-radius,y+height,radius); 
	ctx.arcTo(x,y+height,x,y+height-radius,radius);
	ctx.arcTo(x,y,x+radius,y,radius);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

var DrawGrid = function()
{
	// solid background
	ctx.strokeStyle = 'black';
	ctx.fillStyle = '#8ECCBC';	
	ctx.beginPath();
	ctx.rect( 0, 0, WIDTH, HEIGHT );
	ctx.closePath();
	ctx.fill();
	
	// background lines
	ctx.lineWidth 	= 1;
	ctx.strokeStyle = '#87C1B1';
	ctx.beginPath();
	for ( var i = 0; i < 34; ++i )
	{
		ctx.moveTo( 0.5, 0.5 + TILE_H * i * 0.5 );
		ctx.lineTo( WIDTH + 0.5, 0.5 + TILE_H * i * 0.5 );
	}
	for ( var i = 0; i < 34; ++i )
	{
		ctx.moveTo( 0.5 + i * TILE_W * 0.5, 0.5 );
		ctx.lineTo( 0.5 + i * TILE_W * 0.5, HEIGHT + 0.5 );
	}
	ctx.closePath();
	ctx.stroke();
}

var DrawCrossGrid = function( posX, posY, nodeMinX, nodeMinY, nodeMaxX, nodeMaxY )
{
	ctx.lineWidth	= 1;
	ctx.strokeStyle	= '#75A596'
	ctx.beginPath();	
	for ( var y = nodeMinY; y < nodeMaxY + 1; ++y )
	{
		for ( var x = nodeMinX; x < nodeMaxX + 1; ++x )
		{
			var size = 8;

			ctx.moveTo( posX + x * TILE_W + 0.5, posY + y * TILE_H - size + 0.5 );
			ctx.lineTo( posX + x * TILE_W + 0.5, posY + y * TILE_H + size + 0.5 );

			ctx.moveTo( posX + x * TILE_W - size + 0.5, posY + y * TILE_H + 0.5 );
			ctx.lineTo( posX + x * TILE_W + size + 0.5, posY + y * TILE_H + 0.5 );
		}
	}
	ctx.stroke();
}

var DrawDoneIcon = function( posX, posY )
{
	ctx.strokeStyle = '#665A51';
	ctx.fillStyle 	= '#665A51';
	ctx.lineCap 	= 'round';	
	ctx.lineWidth	= 3;
	ctx.beginPath();
	ctx.moveTo( posX, posY );
	ctx.lineTo( posX - 5, posY - 8 );
	ctx.moveTo( posX, posY );
	ctx.lineTo( posX + 8, posY - 15 );
	ctx.stroke();
}

var DrawStopIcon = function( posX, posY )
{
	ctx.strokeStyle = '#665A51';
	ctx.fillStyle 	= '#665A51';
	ctx.beginPath();
	ctx.rect( posX, posY, 14, 14 );
	ctx.fill();
}

var DrawStepIcon = function( posX, posY )
{
	ctx.strokeStyle = '#665A51';
	ctx.fillStyle 	= '#665A51';
	ctx.beginPath();
	ctx.moveTo( posX, posY );
	ctx.lineTo( posX + 10, posY + 7 );
	ctx.lineTo( posX, posY + 14 );
	ctx.rect( posX + 8, posY, 4, 14 );
	ctx.fill();
}

var DrawRunIcon = function( posX, posY )
{
	posY += 2;

	ctx.strokeStyle = '#665A51';
	ctx.fillStyle 	= '#665A51';
	ctx.beginPath();
	ctx.moveTo( posX, posY );
	ctx.lineTo( posX + 7, posY + 5 );
	ctx.lineTo( posX, posY + 10 );
	ctx.moveTo( posX + 7, posY );
	ctx.lineTo( posX + 7 + 7, posY + 5 );
	ctx.lineTo( posX + 7, posY + 10 );	
	ctx.fill();
}