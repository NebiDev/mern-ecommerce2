class APIFunctionality {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    search() {
        if (this.queryString.keyword) {
          this.query = this.query.where('name').regex(new RegExp(this.queryString.keyword, 'i'));
        }
        return this;
      }
    
    // Filtering

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
        excludedFields.forEach((key) => delete queryObj[key]);
      
        // Object.entries(queryObj).forEach(([key, value]) => {
        //   this.query = this.query.where(key).equals(value);
        // });
        Object.entries(queryObj).forEach(([key, value]) => {
          if (key === 'category') {
            // Case-insensitive match
            this.query = this.query.where(key).regex(new RegExp(`^${value}$`, 'i'));
          } else {
            this.query = this.query.where(key).equals(value);
          }
        });
        

        
      
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