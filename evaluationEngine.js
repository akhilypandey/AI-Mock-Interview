export const evaluateAnswer = (userAnswer, expectedAnswer, question) => {
  const userLower = userAnswer.toLowerCase().trim();
  const expectedLower = expectedAnswer.toLowerCase();
  
  let isCorrect = false;
  let feedback = '';
  let confidence = 0;
  
  // Enhanced evaluation logic
  const keywordMatches = {
    averageif: /averageif/i.test(userLower) && /averageif/i.test(expectedLower),
    vlookup: /vlookup/i.test(userLower) && /vlookup/i.test(expectedLower),
    iferror: /iferror/i.test(userLower) && /iferror/i.test(expectedLower),
    pivot: /pivot/i.test(userLower) && /pivot/i.test(question.text),
    formula: /[=]/g.test(userAnswer) || /formula/i.test(userLower),
    percentage: /percent/i.test(userLower) && /percent/i.test(question.text)
  };
  
  // Scoring logic
  if (keywordMatches.averageif) {
    isCorrect = true;
    confidence = 0.9;
    feedback = 'Excellent! You correctly identified AVERAGEIF as the solution. That shows strong understanding of conditional functions.';
  } else if (keywordMatches.vlookup && keywordMatches.iferror) {
    isCorrect = true;
    confidence = 0.95;
    feedback = 'Outstanding! VLOOKUP with IFERROR is exactly the right approach. You understand error handling perfectly.';
  } else if (keywordMatches.vlookup) {
    isCorrect = true;
    confidence = 0.8;
    feedback = 'Good! VLOOKUP is correct. For bonus points, consider adding error handling with IFERROR.';
  } else if (keywordMatches.pivot) {
    isCorrect = true;
    confidence = 0.8;
    feedback = 'Great understanding of pivot table concepts. You cover all important steps.';
  } else {
    isCorrect = false;
    confidence = 0.3;
    feedback = 'Let me help you think through this. Consider what Excel functions might be useful here.';
  }
  
  return { isCorrect, feedback, confidence };
}