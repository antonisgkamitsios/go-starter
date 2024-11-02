package htmx

import "context"

type HTMXRequest string

var HTMXRequestKEY = HTMXRequest("HTMXRequest")

func GetIfHTMXRequest(ctx context.Context) bool {
	if comesFromHTMX, ok := ctx.Value(HTMXRequestKEY).(bool); ok {
		return comesFromHTMX
	}

	return false
}
