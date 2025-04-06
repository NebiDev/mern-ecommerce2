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
        // Advanced filtering
      
    }
    
    // Sorting

    // sort() {
    //     if (this.queryString.sort) {
    //     const sortBy = this.queryString.sort.split(',').join(' ');
    //     this.query = this.query.sort(sortBy);
    //     } else {
    //     this.query = this.query.sort('-createdAt');
    //     }
    //     return this;
    // }
    
    // Field limiting

    // limitFields() {
    //     if (this.queryString.fields) {
    //     const fields = this.queryString.fields.split(',').join(' ');
    //     this.query = this.query.select(fields);
    //     } else {
    //     this.query = this.query.select('-__v');
    //     }
    //     return this;
    // }
    
    // Pagination

    pagination(resultPerPage) {
        const currentPage = Number(this.queryString.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;

        
        
        // const page = Number(this.queryString.page) || 1;
        // const limit = Number(this.queryString.limit) || 10;
        // const skip = (page - 1) * limit;
    
        // this.query = this.query.skip(skip).limit(limit);
        // return this;
    }
}

export default APIFunctionality;