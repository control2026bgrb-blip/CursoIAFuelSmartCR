// Test script to generate coverage comment locally
import fs from 'fs';

try {
  // Read coverage summary
  const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
  const total = coverage.total;
  
  console.log('## 📊 Test Coverage Report');
  console.log('');
  console.log('| Metric | Coverage | Status |');
  console.log('|--------|----------|--------|');
  console.log(`| Lines | ${total.lines.pct}% | ${total.lines.pct >= 80 ? '✅' : total.lines.pct >= 60 ? '⚠️' : '❌'} |`);
  console.log(`| Functions | ${total.functions.pct}% | ${total.functions.pct >= 80 ? '✅' : total.functions.pct >= 60 ? '⚠️' : '❌'} |`);
  console.log(`| Branches | ${total.branches.pct}% | ${total.branches.pct >= 80 ? '✅' : total.branches.pct >= 60 ? '⚠️' : '❌'} |`);
  console.log(`| Statements | ${total.statements.pct}% | ${total.statements.pct >= 80 ? '✅' : total.statements.pct >= 60 ? '⚠️' : '❌'} |`);
  console.log('');
  console.log('### Coverage Thresholds');
  console.log('- ✅ Good: ≥80%');
  console.log('- ⚠️ Fair: 60-79%'); 
  console.log('- ❌ Poor: <60%');
  console.log('');
  console.log(`**Total Tests:** ${total.lines.covered}/${total.lines.total} lines covered`);
  
} catch (error) {
  console.log('## 📊 Test Coverage Report');
  console.log('');
  console.log('Coverage report generation failed:', error.message);
}