class APIFunctionality {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    search(){
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: 'i',
            },
        } : {};
        this.query = this.query.find({ ...keyword });
        return this;

    }
    
    // Filtering

    filter() {
        const queryObj = { ...this.queryString };
        console.log(queryObj);
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
        excludedFields.forEach((key) => delete queryObj[key]);
        this.query = this.query.find(queryObj);
        return this;   
      
      
    }
    


    pagination(resultPerPage) {
        const currentPage = Number(this.queryString.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;

        
        
        
    }
}

export default APIFunctionality;