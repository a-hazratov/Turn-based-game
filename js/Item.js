class Item {
    constructor(image){
        this.X=null;
        this.Y=null;
        this.ImageSrc=image;
    }
    place(X, Y){
        let _this=this;
        this.X = X;
        this.Y = Y;
        this.image = new Image();
        this.image.src = this.ImageSrc;

        this.image.onload = function(){
            context.drawImage(_this.image, X*36, Y*36);
        }
    }
}