// Package executor provides code execution capabilities.
package executor

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"strings"
	"time"

	problemDomain "leetcode-api/internal/domain/problem"
	submissionDomain "leetcode-api/internal/domain/submission"
)

// CodeExecutor runs code against test cases
type CodeExecutor struct {
	timeout time.Duration
}

// New creates a new CodeExecutor
func New(timeout time.Duration) *CodeExecutor {
	if timeout == 0 {
		timeout = 5 * time.Second
	}
	return &CodeExecutor{timeout: timeout}
}

// Execute runs code against test cases
func (e *CodeExecutor) Execute(language, code string, testCases []problemDomain.TestCase) []submissionDomain.TestResult {
	results := make([]submissionDomain.TestResult, len(testCases))

	for i, tc := range testCases {
		start := time.Now()
		output, err := e.runCode(language, code, tc.Input)
		runtime := int(time.Since(start).Milliseconds())

		actual := strings.TrimSpace(output)
		expected := strings.TrimSpace(tc.Expected)

		results[i] = submissionDomain.TestResult{
			Input:    tc.Input,
			Expected: expected,
			Actual:   actual,
			Passed:   err == nil && actual == expected,
			Runtime:  runtime,
		}

		if err != nil {
			results[i].Actual = err.Error()
			results[i].Passed = false
		}
	}

	return results
}

// runCode executes code in a subprocess
func (e *CodeExecutor) runCode(language, code, input string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), e.timeout)
	defer cancel()

	var cmd *exec.Cmd

	switch language {
	case "javascript":
		wrappedCode := e.wrapJavaScript(code, input)
		cmd = exec.CommandContext(ctx, "node", "-e", wrappedCode)

	case "python":
		wrappedCode := e.wrapPython(code, input)
		cmd = exec.CommandContext(ctx, "python3", "-c", wrappedCode)

	case "go":
		wrappedCode := e.wrapGo(code, input)
		cmd = exec.CommandContext(ctx, "go", "run", "-")
		cmd.Stdin = strings.NewReader(wrappedCode)

	default:
		return "", fmt.Errorf("unsupported language: %s", language)
	}

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err := cmd.Run()
	if ctx.Err() == context.DeadlineExceeded {
		return "", fmt.Errorf("Time Limit Exceeded")
	}
	if err != nil {
		if stderr.Len() > 0 {
			return "", fmt.Errorf("%s", stderr.String())
		}
		return "", err
	}

	return stdout.String(), nil
}

func (e *CodeExecutor) wrapJavaScript(code, input string) string {
	return fmt.Sprintf(`
const input = %s;
%s
const result = twoSum ? twoSum(...input) : 
               isPalindrome ? isPalindrome(...input) :
               maxProfit ? maxProfit(...input) :
               isValid ? isValid(...input) :
               reverseList ? reverseList(...input) :
               null;
console.log(JSON.stringify(result));
`, input, code)
}

func (e *CodeExecutor) wrapPython(code, input string) string {
	return fmt.Sprintf(`
import json
input_data = %s
%s

result = None
if 'twoSum' in dir():
    result = twoSum(*input_data)
elif 'isPalindrome' in dir():
    result = isPalindrome(*input_data)
elif 'maxProfit' in dir():
    result = maxProfit(*input_data)
elif 'isValid' in dir():
    result = isValid(*input_data)
elif 'reverseList' in dir():
    result = reverseList(*input_data)

print(json.dumps(result))
`, input, code)
}

func (e *CodeExecutor) wrapGo(code, input string) string {
	return fmt.Sprintf(`
package main

import (
	"encoding/json"
	"fmt"
)

%s

func main() {
	input := %s
	_ = input
	fmt.Println("[]")
}
`, code, "`"+input+"`")
}
