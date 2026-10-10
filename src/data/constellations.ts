export interface Constellation {id:string;x:number;y:number;w:number;h:number;points:[number,number][];edges:[number,number][];label:[number,number]}
// Original project drawings: a score, spacecraft, route, observation, board and room.
export const constellations:Constellation[] = [
  {id:'sidereal',x:37,y:9,w:18,h:25,points:[[22,30],[75,12],[62,60],[83,78],[87,94]],edges:[[0,1],[1,2],[2,0],[2,3],[3,4]],label:[24,93]},
  {id:'orbit',x:56,y:23,w:21,h:44,points:[[51,4],[85,24],[76,54],[95,84],[47,95],[10,66],[43,43],[39,20]],edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,1],[6,7],[7,0]],label:[12,100]},
  {id:'iter',x:79,y:38,w:16,h:26,points:[[46,8],[83,31],[84,59],[99,94],[49,75],[14,47],[46,8]],edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],label:[14,103]},
  {id:'ayqyn',x:35,y:65,w:15,h:25,points:[[37,9],[70,41],[52,89],[11,68],[20,36],[4,3]],edges:[[0,1],[1,2],[2,3],[3,4],[4,0],[4,5]],label:[30,105]},
  {id:'forme',x:76,y:74,w:16,h:21,points:[[4,57],[20,15],[58,5],[94,43],[4,57]],edges:[[0,1],[1,2],[2,3],[3,0]],label:[20,91]},
  {id:'perch',x:54,y:76,w:14,h:23,points:[[11,43],[37,18],[69,36],[69,69],[95,86],[37,83],[11,43]],edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[3,5]],label:[17,104]}
];
