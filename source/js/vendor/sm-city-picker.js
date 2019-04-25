/*!
 * =====================================================
 * SUI Mobile - http://m.sui.taobao.org/
 *
 * =====================================================
 */
// jshint ignore: start
// jshint ignore: end

/* jshint unused:false*/

+ function($) {
  "use strict";
  var format = function(data) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      if (d.name === "请选择") continue;
      result.push(d.name);
    }
    if (result.length) return result;
    return [""];
  };

  var sub = function(data) {
    if (!data.sub) return [""];
    return format(data.sub);
  };

  var getCities = function(d) {
    for (var i = 0; i < raw.length; i++) {
      if (raw[i].name === d) {
        if (raw[i].sub && raw[i].sub.length) {
          var dist = raw[i].sub[0];
          if (dist.sub && dist.sub.length) {} else {
            if (raw[i].sub[0].id != raw[i].id) {
              var temp = {
                id: raw[i].id,
                name: "不限",
                fuid: raw[i].fuid
              };
              raw[i].sub.unshift(temp);
            }
          }
          return sub(raw[i]);
        }
      }
    }
    return [""];
  };

  var getDistricts = function(p, c) {
    for (var i = 0; i < raw.length; i++) {
      if (raw[i].name === p) {
        if (raw[i].sub) {
          for (var j = 0; j < raw[i].sub.length; j++) {
            if (raw[i].sub[j].name === c) {
              if (raw[i].sub[j].sub && raw[i].sub[j].sub.length) {
                if (raw[i].sub[j].sub[0].id != raw[i].sub[j].id) {
                  var temp = {
                    id: raw[i].sub[j].id,
                    name: "不限",
                    fuid: raw[i].sub[j].fuid
                  }
                  raw[i].sub[j].sub.unshift(temp);
                }
              }
              return sub(raw[i].sub[j]);
            }
          }
        }
      }
    }
    return [""];
  };

  var raw = areaData;

  var setInputData = function(picker) {
    var input = picker.input;
    var proObj = raw[picker.cols[0].activeIndex];
    input.attr('data-proid', proObj.id);
    input.nextAll('input[name="loc_province"]').val(proObj.id);
    if (proObj.sub && proObj.sub.length) {
      var cityObj = proObj.sub[picker.cols[1].activeIndex];
      if (cityObj.id == proObj.id) { //选择了不限
        input.attr('data-cityid', null);
        input.nextAll('input[name="loc_city"]').val(null);
      } else {
        input.attr('data-cityid', cityObj.id);
        input.nextAll('input[name="loc_city"]').val(cityObj.id);
        if (cityObj.sub && cityObj.sub.length) {
          if (picker.cols[2].activeIndex == 0) {
            input.attr('data-distid', null);
            input.nextAll('input[name="loc_county"]').val(null);
          } else {
            var distObj = cityObj.sub[picker.cols[2].activeIndex];
            input.attr('data-distid', distObj.id);
            input.nextAll('input[name="loc_county"]').val(distObj.id);
          }
        } else {
          input.attr('data-distid', null);
          input.nextAll('input[name="loc_county"]').val(null);
        }
      }

    } else {
      input.attr('data-cityid', null);
      input.nextAll('input[name="loc_city"]').val(null);
      input.attr('data-distid', null);
      input.nextAll('input[name="loc_county"]').val(null);
    }
  };

  var getProvinceById = function(pid) {
    for (var i = 0; i < raw.length; i++) {
      if (raw[i].id === pid) return raw[i];
    }
    return [""];
  };

  var getCityById = function(pid, cid) {
    for (var i = 0; i < raw.length; i++) {
      if (raw[i].id === pid) {
        if (raw[i].sub) {
          for (var j = 0; j < raw[i].sub.length; j++) {
            if (raw[i].sub[j].id === cid) {
              return raw[i].sub[j];
            }
          }
        }
      }
    }
    return [""];
  };

  var getDistrictById = function(pid, cid, did) {
    for (var i = 0; i < raw.length; i++) {
      if (raw[i].id === pid) {
        if (raw[i].sub) {
          for (var j = 0; j < raw[i].sub.length; j++) {
            if (raw[i].sub[j].id === cid) {
              if (raw[i].sub[j].sub) {
                for (var k = 0; k < raw[i].sub[j].sub.length; k++) {
                  if (raw[i].sub[j].sub[k].id === did) {
                    return raw[i].sub[j].sub[k];
                  }
                }
              }
            }
          }
        }
      }
    }
    return [""];
  };

  var provinces = raw.map(function(d) {
    return d.name;
  });
  var initCities = [""];
  raw[0].sub.unshift({
    id: raw[0].id,
    name: "不限",
    fuid: raw[0].fuid
  });
  var initCities = sub(raw[0]);
  var initDistricts = [''];
  if(raw[0].sub && raw[0].sub.length > 0){
    initDistricts = getDistricts(provinces[0],raw[0].sub[0].name);
  }

  var currentProvince = provinces[0];
  var currentCity = initCities[0];
  var currentDistrict = initDistricts[0];

  var t,changeCallback;
  var defaults = {

    cssClass: "city-picker",
    rotateEffect: false, //为了性能

    onChange: function(picker, values, displayValues) {
      var newProvince = picker.cols[0].value;
      var newCity;
      if (newProvince !== currentProvince) {
        // 如果Province变化，节流以提高reRender性能
        clearTimeout(t);

        t = setTimeout(function() {
          var newCities = getCities(newProvince);
          newCity = newCities[0];
          var newDistricts = getDistricts(newProvince, newCity);
          picker.cols[1].replaceValues(newCities);
          picker.cols[2].replaceValues(newDistricts);
          currentProvince = newProvince;
          currentCity = newCity;
          picker.updateValue();
        }, 200);
        return;
      }
      newCity = picker.cols[1].value;
      if (newCity !== currentCity) {
        picker.cols[2].replaceValues(getDistricts(newProvince, newCity));
        currentCity = newCity;
        picker.updateValue();
      }

      setInputData(picker);
      changeCallback && changeCallback(picker);
    },

    cols: [{
      textAlign: 'center',
      values: provinces,
      cssClass: "col-province"
    }, {
      textAlign: 'center',
      values: initCities,
      cssClass: "col-city"
    }, {
      textAlign: 'center',
      values: initDistricts,
      cssClass: "col-district"
    }]
  };

  $.fn.cityPicker = function(params) {
    return this.each(function() {
      if (!this) return;
      var hideInputs = $('<input type="hidden" name="loc_province"><input type="hidden" name="loc_city"><input type="hidden" name="loc_county">');
      hideInputs.insertAfter($(this));
      var p = $.extend(defaults, params);
      if(params.changeCallback){
        changeCallback = params.changeCallback;
      }
      var valArr = [];
      var valStr = "";
      var tempStr = "";
      if($(this).data('noinit')){
        tempStr = $(this).val();
        $(this).val('');
      }
      if (p.value) {
        $(this).val(p.value.join(' '));
      } else if($(this).val()){
       p.value = [];
         if ($(this).val().indexOf(' ') > 0){
           p.value = $(this).val().split(' ');
         }else{
           p.value[0] = $(this).val();
         }
      }else{
        var val = $(this).data('value');
        if (val) {
          val = val.toString();
          p.value = [];
          if (val.indexOf(' ') > 0) {
            valArr = val.split(' ');
            if (valArr[0]) {
              p.value[0] = getProvinceById(valArr[0]).name;
              valStr += p.value[0];
            }

            if (valArr[1]) {
              p.value[1] = getCityById(valArr[0], valArr[1]).name;
              valStr += " " + p.value[1];
            }

            if (valArr[2]) {
              p.value[2] = getDistrictById(valArr[0], valArr[1], valArr[2]).name;
              valStr += " " + p.value[2];
            }
          } else {
            p.value[0] = getProvinceById(val).name;
            valStr += p.value[0];
            p.value[1] = "";
            p.value[2] = "";
            valArr[0] = val;
          }
        }
      }

      if(valStr){
        $(this).val(valStr);
      }

      if (p.value) {
        //p.value = val.split(" ");
        if (p.value[0]) {
          currentProvince = p.value[0];
          hideInputs.eq(0).val(valArr[0]);
          p.cols[1].values = getCities(p.value[0]);
        }
        if (p.value[1]) {
          currentCity = p.value[1];
          hideInputs.eq(1).val(valArr[1]);
          p.cols[2].values = getDistricts(p.value[0], p.value[1]);
        } else {
          p.cols[2].values = getDistricts(p.value[0], p.cols[1].values[0]);

        }
        if (p.value[2]) {
          currentDistrict = p.value[2];
          hideInputs.eq(2).val(valArr[2]);
        } else {
          p.value[2] = '';
          currentDistrict = p.value[2];
        }
      }
      $(this).picker(p);

      if($(this).data('noinit')){
          $(this).val(tempStr);
        }
    });
  };

}(Zepto);
