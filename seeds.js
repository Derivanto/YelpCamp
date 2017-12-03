var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
        {
            name: "Clouds Rest", 
            image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg",
            description: "Beholde the mighty clouds!!!  <p>Proin nec nisi semper, pellentesque nulla vel, molestie arcu. Donec porta cursus mauris, et dignissim orci scelerisque quis. Donec suscipit dolor sit amet urna commodo, sed finibus nulla consequat. Vivamus eu mi nec odio interdum pretium. In interdum, dolor eu ultricies euismod, velit purus consectetur velit, vitae ultricies mi lorem condimentum eros. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec nec lacinia purus. Nunc non lorem eu enim ultricies sodales sollicitudin eu nisi. Cras nec malesuada nunc. Nunc quis ipsum euismod, consectetur massa non, laoreet sapien. Mauris elementum scelerisque massa, eget viverra arcu tempus vel. Nam tristique tempus fringilla. Integer interdum erat ac venenatis varius. Ut porta orci lacus, eu hendrerit augue semper nec. Praesent dignissim rhoncus viverra. Proin mollis quam a urna auctor, vitae pulvinar velit vestibulum.</p><p>Maecenas ipsum est, porta ut luctus hendrerit, accumsan nec arcu. Sed scelerisque convallis felis id venenatis. In facilisis risus metus. Morbi ultrices sapien nec lorem gravida interdum. Sed cursus dolor nunc, gravida iaculis tortor ultrices gravida. Sed porta orci ac mauris lacinia, at molestie dolor cursus. Maecenas congue porttitor massa, a pulvinar lacus pretium sed. Etiam non ipsum vel magna hendrerit convallis eu ac est. Suspendisse bibendum pulvinar lacus id semper.</p><p>Nunc sed auctor ex. Integer porttitor sed augue eu interdum. Vestibulum convallis dui eu dapibus tincidunt. Vivamus commodo commodo magna, id euismod dolor laoreet nec. Nulla venenatis, ligula ac semper iaculis, nibh ante ultricies tellus, et ultricies mauris ex sit amet nisi. Phasellus pharetra massa in pharetra mollis. Donec id sollicitudin lorem. Cras quis enim rutrum mi sodales suscipit eu in quam. Proin a euismod est. Phasellus ultrices purus eros, vitae malesuada nunc laoreet non. Ut porta magna eros, iaculis sagittis massa dictum ac. Sed ac lorem tincidunt arcu vulputate iaculis et sit amet lorem. Etiam facilisis dapibus scelerisque. Etiam pretium efficitur imperdiet. Integer id quam vitae urna pellentesque mollis.</p><p>Cras interdum ante vel erat efficitur porta. Nullam auctor nibh non mi vehicula, quis pulvinar neque semper. Sed lacinia pretium mauris. Suspendisse accumsan nibh et mauris pretium tempor. Pellentesque odio ex, pharetra auctor ex et, congue pulvinar metus. Nullam et sem augue. Nam tristique vestibulum enim non egestas. Quisque accumsan leo in sollicitudin cursus. Vivamus non pulvinar lorem. Nulla feugiat tortor eget suscipit auctor. Nulla facilisi. Sed dictum aliquam nisl non tincidunt. Phasellus odio nibh, scelerisque ut consequat eget, vulputate vitae risus. Suspendisse rutrum nibh non tempus interdum. Nulla facilisi. Fusce sollicitudin pharetra orci, a volutpat lorem porta vitae. </p>"
        },
        {
            name: "Desert Mesa", 
            image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
            description: "Carefull of moving sands"
        },
        {
            name: "Canyon Floor", 
            image: "https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg",
            description: "Not what you have expected"
        },
    ];

function seedDB(){
    //remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("campgrounds removed !@");
    //add few campgrounds
        data.forEach(function(seed, i){
            Campground.create(seed, function(err, camp){
                if(err){
                    console.log(err);
                }else {
                    console.log("added a new seeded campground");
                    //create a comment
                    Comment.create({
                        text: "Great place but no internet " + i, 
                        author: "Homer"
                    }, function(err, comment){
                      if(err){
                          console.log(err);
                      }else {
                          camp.comments.push(comment);
                          camp.save();
                          console.log("created a new comment");
                      }
                    });
                }
            });
        });
    });
};

module.exports = seedDB;