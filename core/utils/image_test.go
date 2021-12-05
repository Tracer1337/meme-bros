package utils

import "testing"

func TestGetMimeTypeFromBase64(t *testing.T) {
	input := "data:image/png;base64,this-is-my-data"
	expect := "image/png"
	got := GetMimeTypeFromBase64(input)
	if got != expect {
		t.Errorf(
			"Got wrong mime type for input '%s'. Expected: '%s' but got '%s'",
			input, expect, got,
		)
	}
}
