package model

type Paging struct {
	CurrentPage uint `json:"currentPage"`
	PageSize    uint `json:"pageSize"`
	Total       uint `json:"total"`
}

type PagingInput struct {
	CurrentPage uint `json:"currentPage,omitempty"`
	PageSize    uint `json:"pageSize,omitempty"`
}
