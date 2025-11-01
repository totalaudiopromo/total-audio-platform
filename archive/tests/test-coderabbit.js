// Test file for CodeRabbit review
// This file has some intentional issues that CodeRabbit should catch

function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i]; // Missing error handling
  }
  return total;
}

// Unused variable
const unusedVar = 'this should be flagged';

// Console.log in production code
console.log('Debug info');

// Missing semicolon
const name = 'test';

// Potential security issue
eval("console.log('hello')");

// Inconsistent naming
function getUserData() {
  return fetch('/api/user')
    .then(response => response.json())
    .catch(error => {
      console.error(error);
    });
}

// Magic numbers
function calculateTax(amount) {
  return amount * 0.2; // Should be a constant
}

// Long function that could be split
function processUserData(user) {
  if (user.age > 18) {
    if (user.hasPermission) {
      if (user.isActive) {
        if (user.emailVerified) {
          return 'Valid user';
        } else {
          return 'Email not verified';
        }
      } else {
        return 'User not active';
      }
    } else {
      return 'No permission';
    }
  } else {
    return 'Too young';
  }
}
