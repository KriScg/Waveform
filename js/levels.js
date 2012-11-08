var GateTypeEnum =
{
	NOT	: 0,
	AND	: 1,
	OR	: 2
}

var gLevels = new Array
(
	// level 1
	{ 
		name:".01 Routing",
		desc:"Route clock from input to output.",
		nodes:new Array
		(
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 1, 1, 0, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		),
		output:
		{
			name:"Output", 
			nodeX:6, 
			nodeY:4,
			waveform:new Array( 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 )
		},
		inputs:new Array
		(
			{ 
				name:"Input",
				nodeX:2,
				nodeY:4,
				waveform:new Array( 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 )
			}
		),
	},
	
	// level 2
	{
		name:".02 Inverted",
		desc:"Invert clock input and route it to output.",
		nodes:new Array
		(
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 2, 1, 1, 0, 0, 0,			
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		),
		output:
		{
			name:"Output", 
			nodeX:6, 
			nodeY:4,
			waveform:new Array( 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 )
		},
		inputs:new Array
		(
			{
				name:"Input",
				nodeX:3,
				nodeY:4,
				waveform:new Array( 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 )
			}
		),
	},
	
	// level 3
	{
		name:".03 Continuous",
		desc:"temp desc",
		nodes:new Array
		(
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
			0, 0, 1, 2, 1, 3, 1, 1, 0, 0,
			0, 0, 0, 0, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,			
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		),
		output:
		{
			name:"Output", 
			nodeX:7, 
			nodeY:4,
			waveform:new Array( 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 )
		},
		inputs:new Array
		(
			{
				name:"Input",
				nodeX:2,
				nodeY:4,
				waveform:new Array( 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 )
			}
		),
	}	
);