var GateTypeEnum =
{
	NOT		: 0,
	OR		: 1,
	AND		: 2,
	CROSS	: 3
}

var gLevels =
[
	{
		name:'Routing',
		desc:'Route clock signal from input to output. Click between adjacent nodes in order to connect them horizontally or vertically. After connecting nodes use verify button. Reference output waveform needs to match simulated waveform.',
		toolboxStateMax:0,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'Input',
				nodeX:3,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'Output', 
				nodeX:5, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			}
		]
	},
	{
		name:'Inverted',
		desc:'Use NOT gate to invert input and route it to output. Select NOT gate by pressing "2" or selecting it with mouse and place it horizontally between two adjacent nodes. Use the step button in order to debug the design.',
		toolboxStateMax:1,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'Input',
				nodeX:3,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'Output', 
				nodeX:5, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ]
			}
		]
	},
	{
		name:'Continuous',
		desc:'...',
		toolboxStateMax:1,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,			
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'Input',
				nodeX:3,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
			},			
		]
	},
	{
		name:'Undefined',
		desc:'There are 3 types of signal: LO (blue), HI (red) and undefined (purple).',
		toolboxStateMax:1,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,			
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'Input',
				nodeX:3,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ]
			}
		]
	},
	{
		name:'Mixed',
		desc:'...',
		toolboxStateMax:1,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,			
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'Input',
				nodeX:3,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2 ]
			}
		]
	},	
	{
		name:'Maximum',
		desc:'Try to analyze input and output signals and find the pattern. Remember to use new available gate type - OR. It produces HI if any of it\'s inputs are HI.',
		toolboxStateMax:2,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[	
			{
				name:'InputA',
				nodeX:2,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'InputB',
				nodeX:2,
				nodeY:5,
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ]
			}			
		]
	},
	{
		name:'Conditional',
		desc:'New gate type is available - AND. It produces HI signal only if both inputs are HI.',
		toolboxStateMax:3,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:2,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'InputB',
				nodeX:2,
				nodeY:5,
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1 ]
			}
		]
	},
	{
		name:'Exclusive',
		desc:'...',
		toolboxStateMax:3,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:2,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'InputB',
				nodeX:2,
				nodeY:5,
				waveform:[ 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1 ]
			},
		]
	},
	{
		name:'Match',
		desc:'...',
		toolboxStateMax:3,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:2,
				nodeY:4,
				waveform:[ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ]
			},
			{
				name:'InputB',
				nodeX:2,
				nodeY:5,
				waveform:[ 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ]
			},
			{
				name:'InputC',
				nodeX:2,
				nodeY:6,
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},		
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 ]
			}		
		]
	},
	{
		name:'Selector',
		desc:'...',
		toolboxStateMax:3,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:2,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'InputB',
				nodeX:2,
				nodeY:5,
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},
			{
				name:'InputC',
				nodeX:2,
				nodeY:6,
				waveform:[ 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1 ]
			},			
		]
	},
	{
		name:'Crossing',
		desc:'Use CROSS gate to intersect signal path\'s.',
		toolboxStateMax:4,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:3,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'InputB',
				nodeX:3,
				nodeY:5,
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},
			{
				name:'OutputA',
				nodeX:6,
				nodeY:4,
				simWaveform:[],
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},
			{
				name:'OutputB', 
				nodeX:6, 
				nodeY:5,
				simWaveform:[],
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},			
		]
	},
	{
		name:'Madness',
		desc:'...',
		toolboxStateMax:4,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:3,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'InputB',
				nodeX:3,
				nodeY:5,
				waveform:[ 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0 ]
			},
			{
				name:'Output',
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 2, 2, 1, 0, 2, 0, 1, 2, 1, 0, 2, 2, 1, 0, 2, 0, 1, 2, 1 ]
			},			
		]
	},	
	{
		name:'State',
		desc:'Now this one is a bit different...',
		toolboxStateMax:4,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'InputR',
				nodeX:3,
				nodeY:4,
				waveform:[ 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ]
			},
			{
				name:'InputS',
				nodeX:3,
				nodeY:5,
				waveform:[ 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 ]
			},		
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1 ]
			}
		]
	},
	{
		name:'TEST',
		desc:'...',
		toolboxStateMax:4,
		nodes:
		[
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:0,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'Output', 
				nodeX:9, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1 ]
			},			
		]
	}
];

for ( var i = 0; i < gLevels.length; ++i )
{
	gLevels[ i ].name = ( i < 9 ? '.0' : '.' ) + ( i + 1 ) + ' ' + gLevels[ i ].name;
}