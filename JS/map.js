  var windowsArr = [];
    var marker = [];
    var map = new AMap.Map("mapContainer", {
            resizeEnable: true,
            center: [121.48, 31.22],//地图中心点
            zoom: 10,//地图显示的缩放级别
            keyboardEnable: false
    });
    AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch','AMap.Geocoder'],function(){
      var autoOptions = {
        city: "上海", //城市，默认全国
        input: "keyword"//使用联想输入的input的id
      };
      autocomplete= new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
            city:'上海',
            map:map
      })
      AMap.event.addListener(autocomplete, "select", function(e){
         //TODO 针对选中的poi实现自己的功能
         placeSearch.search(e.poi.name)
      });
    });
    function keyUp(){
      var address = '';
      var inp = document.getElementById('keyword');
      if(inp.value == ''){
        return false;
      }else{
        address = inp.value;
      }
        $.ajax({
          type:"get",
          url:"http://restapi.amap.com/v3/assistant/inputtips?output=json&city=010&keywords="+address+"&key=825baa54f964c53c9c46a39576729f7c",
          async:true,
          success : function(data){
            $('#addressUl').empty();
            var html='';
            for ( var i = 0;  i < data.tips.length - 1;  i++) {
              var {
                adcode,
                address,
                district,
                id,
                location,
                name,
                typecode
              } = data.tips[i];
              if (location != '' && location != null) {
                html += '<li data-location="'+location+'" set-name="'+name+'" class="Address-click list-group-item glyphicon glyphicon-map-marker"><a href="#">'+name+'</a><span class="pull-right">'+district+'</span></li>';
              }
               
            }
            
          $('#addressUl').append(html);
          getAddressClick();
          // console.log(location);
          },error : function(data){
              console.info(data);     
          }
      });
    }

    function getAddressClick(){
        var clickArray = $('.Address-click');
        for (var i=0;i<clickArray.length;i++) {
         $(clickArray[i]).click(function(){
            $('#addressUl').hide();
            var locationArry = this.getAttribute('data-location');
            lnglatXY = [];
            var locationName = this.getAttribute('set-name');
            var locationNaN = locationArry.split(',');
            var locationone = parseFloat(locationNaN[0]);
            var locationtwo = parseFloat(locationNaN[1]);
            lnglatXY.push(locationone,locationtwo);
             



            map = new AMap.Map("mapContainer", {
            resizeEnable: true,
            center: lnglatXY,//地图中心点
            zoom: 15,//地图显示的缩放级别
            keyboardEnable: false
            });
                regeocoder();
                // geocoder_CallBack(locationName);
          })
        }
    }

    //地图页面添加点标记  坐标--地址
    var lnglatXY = []; //已知点坐标
    function regeocoder() {  //逆地理编码
        var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });        
        geocoder.getAddress(lnglatXY, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                // geocoder_CallBack(result);
            }
        });        
        var marker = new AMap.Marker({  //加点
            map: map,
            position: lnglatXY
        });
        map.setFitView();
         getTmc()
    }

    // function geocoder_CallBack(data) {
    //     var address = data;//返回地址描述
    //     document.getElementById("result").innerHTML = address;
    // }

  $('.form-control').focus(function(){
    $('#addressUl').show();
  })
  $('#mapContainer').click(function(){
    $('#addressUl').hide();
  })
  //user_from
  $('.user_btn').click(function(){
    $('.user_btn').css('color','#3c5a86');
    $('.userUl').show();
  })
  $('#mapContainer').click(function(){
    $('.userUl').hide();
     $('.user_btn').css('color','#868080');
  })

  //实时路况图层
  function getTmc(){
     var trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 10
    });
    trafficLayer.setMap(map);
  
    // var isVisible = true;
    var isVisible = false;
    AMap.event.addDomListener(document.getElementById('control'), 'click', function() {
        if (isVisible) {
            trafficLayer.hide();
            isVisible = false;
        } else {
            trafficLayer.show();
            isVisible = true;
        }
    }, false);
  }
  getTmc();