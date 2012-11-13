var DrawButton = function( button )
{
	if ( button.enabled )
	{
		ctx.strokeStyle	= button.focus ? 'red' : 'black';
		ctx.fillStyle 	= button.background;
		ctx.lineWidth 	= 2;
		ctx.beginPath();
		ctx.rect( button.posX, button.posY, button.width, button.height );
		ctx.closePath();
		ctx.fill();		
		ctx.stroke();
		
		ctx.textAlign 		= 'center';		
		ctx.textBaseline 	= 'middle';
		ctx.fillStyle 		= 'black'
		ctx.fillText( button.text, button.posX + button.width * 0.5, button.posY + button.height * 0.5 );
	}
}

var ButtonMouseDown = function( button, mousePosX, mousePosY )
{
	return mousePosX >= button.posX && mousePosX <= button.posX + button.width && mousePosY >= button.posY && mousePosY <= button.posY + button.height;
}