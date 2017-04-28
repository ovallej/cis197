
function updateMatrix(m1, m2, m3) {
  //calculates m1 - m2 + m3
  //assumes they all match in sizes
  var totalDays = m1[0].length ? m1[0].length : 0;
  var outputMatrix = new Array(m1.length).fill(0).map(() => new Array(totalDays).fill(0));
  new Array(14).fill(0).map(() => new Array(eventDates.length).fill(0));
  for (var i = 0; i < m1.length; i++) {
  	for (var j = 0; j < m1[i].length; j++) {
  		outputMatrix[i][j] = m1[i][j] - m2[i][j] + m3[i][j];
  	}
  }
  return outputMatrix;
}