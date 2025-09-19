export const AI_RESPONSES = {
  intro: "Hello! I'm Alex, your AI Excel interviewer. I'll assess your spreadsheet skills through practical scenarios. This interview takes 15-20 minutes and covers formulas, data analysis, and problem-solving. You can interrupt me at any time by speaking. Are you ready to begin?",
  
  skillCheck: "Let's start with a quick skill assessment. On a scale of 1 to 10, how would you rate your Excel proficiency? This helps me tailor the questions appropriately. Just speak your number.",
  
  questions: {
    beginner: [
      {
        id: 1,
        text: "Let's start with basics. If cell A1 contains 100 and A2 contains 50, what formula would you write in A3 to calculate the percentage increase from A2 to A1? Please explain your approach.",
        expectedAnswer: "=(A1-A2)/A2*100 or =(A1-A2)/A2",
        hints: ["Think about the percentage change formula", "You need to find the difference first"],
        category: "Basic Formulas"
      },
      {
        id: 2,
        text: "You have a list of sales data in column A from A1 to A10. How would you create a formula to find the average, excluding any zero values? Walk me through your solution.",
        expectedAnswer: "=AVERAGEIF(A1:A10,\">0\")",
        hints: ["Consider conditional averaging", "You want to exclude zeros"],
        category: "Conditional Functions"
      }
    ],
    intermediate: [
      {
        id: 3,
        text: "You have employee data: Column A has names, Column B has departments, Column C has salaries. How would you find the average salary for the Sales department? Please explain the formula you would use.",
        expectedAnswer: "=AVERAGEIF(B:B,\"Sales\",C:C)",
        hints: ["You need to average based on criteria", "Think about which function takes multiple ranges"],
        category: "Data Analysis"
      },
      {
        id: 4,
        text: "Describe how you would create a pivot table to analyze monthly sales by region. What specific steps would you take? Walk me through the entire process.",
        expectedAnswer: "Insert > PivotTable, drag Region to Rows, Month to Columns, Sales to Values",
        hints: ["Think about the Insert menu", "Consider what goes in rows vs columns vs values"],
        category: "Pivot Tables"
      }
    ],
    advanced: [
      {
        id: 5,
        text: "You need to create a dynamic lookup that finds the salary of an employee, but if the employee doesn't exist, it should return 'Not Found'. How would you accomplish this? Explain your complete formula.",
        expectedAnswer: "=IFERROR(VLOOKUP(lookup_value,table_array,col_index,FALSE),\"Not Found\")",
        hints: ["Combine lookup with error handling", "Think about what happens when VLOOKUP fails"],
        category: "Advanced Formulas"
      }
    ]
  }
};

export const SKILL_LEVELS = {
  1: 'beginner', 2: 'beginner', 3: 'beginner',
  4: 'intermediate', 5: 'intermediate', 6: 'intermediate', 7: 'intermediate',
  8: 'advanced', 9: 'advanced', 10: 'advanced'
};