class ApiResponse{
    constructor(statusCode,data,message="success",success){
     this.statusCode=statusCode<400 && statusCode ;
     this.data=data;
     this.message=message;
     this.success=success;
    }
}