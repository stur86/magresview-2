/**
 * Functions used to update the state of the app as a whole. These have a 
 * strict hierarchy that allows all changes to cascade properly.
 *
 */

import { msDisplayEllipsoids, msDisplayLabels, msDisplayCScales } from './interfaces/MSInterface';
import { efgDisplayEllipsoids, efgDisplayLabels, efgDisplayCScales } from './interfaces/EFGInterface';
import { dipDisplayLinks } from './interfaces/DipInterface';
import { selShowLabels } from './interfaces/SelInterface';

// The hierarchy works as follow:
// 
// 1. Any functions that will have side effects in terms of atoms that are selected
//    and/or displayed (normally or as ghosts) execute. They also call inside...
// 2. The updateSelections function, which performs those updates, and then calls inside
// 3. All the visualisation functions such as msDisplayEllipsoids, selShowLabels, etc., 
//    which act based on selected and displayed atoms.
//    
// Each of these functions must have the following interface:
// 
// updateFunction(state, new_state={}) {
//      
//      < Do stuff... >
//      
//      return updated_state;
// }
// 
// taking the state as first argument, a series of parameters that will update
// the state as second, and then merging them (with any other added parameters)
// and returning the updated state as a result. The goal is for them to be possible
// to simply use in a 'call' action with the store's reducer.