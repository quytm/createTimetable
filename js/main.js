$("#btnAddSubject").click(function() {
    $("#sidebar-wrapper").animate({top: "111px"}, 100);
    $("#bg-sidebar").toggleClass("bg-sidebar");
});

$("#bg-sidebar").click(function() {
    $("#sidebar-wrapper").animate({top: "-600px"}, 100);
    $("#bg-sidebar").toggleClass("bg-sidebar");
});

$("#closeListSubject").click(function() {
    $("#sidebar-wrapper").animate({top: "-600px"}, 100);
    $("#bg-sidebar").toggleClass("bg-sidebar");
});

var soMon = 0;
var soTin = 0;
var bgs = [];//Mảng chứa danh sách backgroud của lớp môn học đã được chọn
var dataMonHoc;//Chứa dữ liệu của tất cả môn học
var monHocs = [];

//Chuyển từ vị trí và số tiết sang dạng xâu: <strong>Thứ 4</strong> 8-10 (CL)
function cvtTime(viTri, soTiet, nhom) {
    var str = "<strong>Thứ ";
    str += parseInt(viTri/10) + 2;
    var tietDau = parseInt(viTri % 10);
    var tietCuoi = parseInt(tietDau + soTiet - 1);
    var theLoai;
    if (nhom === 0) {
        theLoai = "CL";
    } else {
        theLoai = "N" + nhom;
    }
    str += "</strong> " + tietDau + "-" + tietCuoi + " (" + theLoai + ")";
    return str;
}

//Chuyển từ vị trí và số tiết sang xâu: <strong>Thứ 4</strong> | Tiết 8-10 (CL)
function cvtTimeFull(viTri, soTiet, nhom) {
    var str = "Thứ ";
    str += parseInt(viTri/10) + 2;
    var tietDau = parseInt(viTri % 10);
    var tietCuoi = parseInt(tietDau + soTiet - 1);
    var theLoai;
    if (nhom === 0) {
        theLoai = "CL";
    } else {
        theLoai = "N" + nhom;
    }
    str += " | Tiết " + tietDau + "-" + tietCuoi + " (" + theLoai + ")";
    return str;
}

//Thêm môn học
function addSubject(index) {
    var subject = $("#subject-" + index);
    subject.removeClass("list-group-item-info");
    subject.addClass("list-group-item-warning");
    subject.attr("onclick", "removeSubject(" + index + ")");

    var subjectX = $("#subjectX-" + index);
    subjectX.show();

    $("#tick-subject-" + index).show();
}

//Xóa môn học
function removeSubject(index) {
    var subject = $("#subject-" + index);
    subject.addClass("list-group-item-info");
    subject.removeClass("list-group-item-warning");
    subject.attr("onclick", "addSubject(" + index + ")");

    var subjectX = $("#subjectX-" + index);
    subjectX.hide();

    $("#tick-subject-" + index).hide();
}

//Thêm thông tin chi tiết của lớp môn học
function infoLesson() {
    for (var i = 0; i < dataMonHoc.length; i++) {
        var lopMHs = dataMonHoc[i].lopMHs;
        var tenMH = dataMonHoc[i].tenMH;

        for (var j = 0; j < lopMHs.length; j++) {
            var id = lopMHs[j].id;
            var maLMH = lopMHs[j].maLMH;

            var html = "<div>";
            html += "<span style='text-align: center; font-weight: bold;'>" + tenMH + "</span><br>";
            html += "<span>Mã LMH: " + maLMH + "</span><br>";
            var buoiHocs = lopMHs[j].buoiHocs;
            for (var t = 0; t < buoiHocs.length; t++) {
                var viTri = buoiHocs[t].viTri;
                var soTiet = buoiHocs[t].soTiet;
                var nhom = buoiHocs[t].nhom;
                var giaoVien = buoiHocs[t].giaoVien;
                var giangDuong = buoiHocs[t].giangDuong;
                var thoiGian = cvtTimeFull(viTri, soTiet, nhom);

                var buoi = "<br><span> " + thoiGian + "</span><br>";
                buoi += "<span style='padding-left: 4px;'>- Giảng viên: " + giaoVien + "</span><br>"
                    + "<span style='padding-left: 4px;'>- Giảng đường: " + giangDuong + "</span><br>";

                html += buoi;
            }
            html += "</div>";

            var lopmh = $("#lopmh-" + id);
            lopmh.tooltipster({
                theme   : "tooltipster-light",
                position: "right",
                content : $(html),
                delay   : 500,
                trigger : 'hover',
                animation: 'fade',
                hideOnClick: true
            });
        }
    }
}

// Get dữ liệu từ phía server
$(document).ready(function () {
    $.ajax({
        url     : "./api/getmonhoc.php",
        method  : "GET",
        dataType: "json",
        success : function(data) {
            dataMonHoc = data;

            for (var i=0; i<data.length; i++) {
                //Khởi tạo DOM cho danh sách môn học
                var li = "<li class='list-group-item list-group-item-info monhoc' id='subject-" + i + "' onclick='addSubject(" + i +");'>"
                    + data[i].tenMH + "<span class='glyphicon glyphicon-ok tick-status' id='tick-subject-" + i + "' style='display: none'></span></li>";
                $("#list-subject").append(li);

                //Khởi tạo DOM cho #list-lesson
                var listLessonHTML = "<div id='subjectX-" + i + "' style='display: none'><li class='list-group-item list-group-item-success head-lesson'>"
                    + data[i].tenMH + "<span class='glyphicon glyphicon-remove btn-remove' onclick='removeSubject(" + i + ");'></span></li>";

                var lopMHs = data[i].lopMHs;
                for (var j = 0; j < lopMHs.length; j++) {
                    listLessonHTML += "<li class='list-group-item lopmh list-group-item-info' onclick='themLMH(" + i + "," + j + ");' id='lopmh-" + lopMHs[j].id + "'>";
                    var buoiHocs = lopMHs[j].buoiHocs;
                    for (var t = 0; t < buoiHocs.length - 1; t++) {
                        listLessonHTML += cvtTime(buoiHocs[t].viTri, buoiHocs[t].soTiet, buoiHocs[t].nhom) + " | ";
                    }
                    listLessonHTML += cvtTime(buoiHocs[buoiHocs.length - 1].viTri, buoiHocs[buoiHocs.length - 1].soTiet, buoiHocs[buoiHocs.length - 1].nhom);

                    listLessonHTML += "<span class='glyphicon glyphicon-ok tick-status' id='tick-lopmh-" + lopMHs[j].id + "' style='display: none'></span></li>";
                }

                listLessonHTML += "</div>";

                $("#list-lesson").append(listLessonHTML);
            }
            infoLesson();
        }
    });
});

//Thêm lớp môn học vào lịch tuần
function themLMH(mon, lop) {
    var monhoc = dataMonHoc[mon];
    var tenMH = monhoc.tenMH;
    var lopMHs = monhoc.lopMHs;

    var lopMH = lopMHs[lop];
    var maLMH = lopMH.maLMH;
    var buoiHocs = lopMH.buoiHocs;

    for (var i = 0; i < buoiHocs.length; i++) {
        var viTri = buoiHocs[i].viTri;
        var soTiet = buoiHocs[i].soTiet;

        //Kiểm tra xem có bị trùng thời gian hay không?
        if (ktTrungThoiGian(viTri, soTiet)) {
            thongBao("<strong>Trùng lịch!</strong><br>Buổi học đó của bạn đã bị trùng!", "error");
            return;
        }
    }

    if (ktTrungMon(monhoc.id)) {
        thongBao("<strong>Trùng môn</strong><br>Bạn đã đăng ký môn này!", "warning");
    }

    var bg = getBG(lopMH.id);
    for (var i = 0; i < buoiHocs.length; i++) {
        var viTri = buoiHocs[i].viTri;
        var soTiet = buoiHocs[i].soTiet;
        var nhom = buoiHocs[i].nhom;
        var theLoai;
        if (nhom === 0) {
            theLoai = "CL";
        } else {
            theLoai = "N" + nhom;
        }

        //Thêm buổi học vào lịch tuần
        var location = $("#location-" + viTri);//Định vị ô cần chèn
        var buoiHTML = "<div><button class='close' title='Bỏ chọn' onclick='xoaLMH(" + mon + "," + lop + ");'>×</button><span class='name-subject'>"
            + tenMH + "</span><span>" + maLMH + " (" + theLoai + ")</span></div>";
        location.html(buoiHTML);
        location.attr("rowspan", soTiet);
        location.addClass("bg-lesson-" + bg);

        //Ẩn những ô thừa
        for (var j = viTri + 1; j < viTri + soTiet; j++) {
            $("#location-" + j).hide();
        }
    }

    var lopmhDOM = $("#lopmh-" + lopMH.id);
    lopmhDOM.removeClass("list-group-item-info");
    lopmhDOM.addClass("list-group-item-warning");
    lopmhDOM.attr("onclick", "xoaLMH(" + mon + "," + lop + ")");
    var tickDOM = $("#tick-lopmh-" + lopMH.id);
    tickDOM.show();

    addMHtoArr(monhoc.id);
    soMon++;
    soTin += monhoc.soTin;

    updateInfo();
}

//Xóa lớp môn học khỏi lịch tuần
function xoaLMH(mon, lop) {
    var monhoc = dataMonHoc[mon];
    var lopMHs = monhoc.lopMHs;

    var lopMH = lopMHs[lop];
    var buoiHocs = lopMH.buoiHocs;

    for (var i = 0; i < buoiHocs.length; i++) {
        var viTri = buoiHocs[i].viTri;
        var soTiet = buoiHocs[i].soTiet;

        //Làm rỗng ô
        var location = $("#location-" + viTri);//Định vị ô cần làm rỗng
        location.empty();
        location.attr("rowspan", 1);
        location.attr("class", "");

        //Hiện lại những ô bị ẩn
        for (var j = viTri + 1; j < viTri + soTiet; j++) {
            $("#location-" + j).show();
        }
    }

    var lopmhDOM = $("#lopmh-" + lopMH.id);
    lopmhDOM.addClass("list-group-item-info");
    lopmhDOM.removeClass("list-group-item-warning");
    lopmhDOM.attr("onclick", "themLMH(" + mon + "," + lop + ")");
    var tickDOM = $("#tick-lopmh-" + lopMH.id);
    tickDOM.hide();

    removeBG(lopMH.id);
    removeMHformArr(monhoc.id);
    soMon--;
    soTin -= monhoc.soTin;

    updateInfo();
}

//Update số môn và số tín
function updateInfo() {
    $("#soMon").text(soMon);
    $("#soTin").text(soTin);
}

//Kiểm tra xem có trùng thời gian trên lịch tuần không?
function ktTrungThoiGian(viTri, soTiet) {
    for (var i=viTri; i<viTri + soTiet; i++) {
        var locationID = $("#location-" + i);

        if (locationID.text()) {
            var x = locationID.attr("class");
            locationID.addClass("animated shake").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass();
                $(this).attr("class", x);
            });
            return true;
        }

        if (locationID.css("display") == "none") {
            var begin = parseInt(i / 10) * 10;
            for (var j = i - 1; j >= begin; j--) {
                var temp = $("#location-" + j);
                if (temp.html() != "") {
                    var x = temp.attr("class");
                    temp.addClass("animated shake").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                        $(this).removeClass();
                        $(this).attr("class", x);
                    });
                    break;
                }
            }
            return true;
        }
    }

    return false;
}

//Tìm background hợp lý để thêm vào lớp môn học vừa được chọn
function getBG(item) {
    for (var i=0; i<bgs.length; i++) {
        if (bgs[i] == -1) {
            bgs[i] = item;
            return i;
        }
    }

    bgs.push(item);
    return bgs.length - 1;
}

//Xóa background của lớp môn học đã bị xóa ra khỏi list bgs
function removeBG(item) {
    var i = bgs.indexOf(item);
    if (i >= 0) {
        bgs[i] = -1;
    }
}

//Thêm id của môn học vào list môn học để theo dõi môn nào đã được chọn
function addMHtoArr(id) {
    for (var i = 0; i < monHocs.length; i++) {
        if (bgs[i] === -1) {
            bgs[i] = id;
            return;
        }
    }

    monHocs.push(id);
}

//Xóa id môn học khỏi list môn học
function removeMHformArr(id) {
    var i = monHocs.indexOf(id);
    if (i >= 0) {
        monHocs[i] = -1;
    }
}

//Kiểm tra có đăng ký trùng môn không?
function ktTrungMon(id) {
    return (monHocs.indexOf(id) >= 0);
}

//Thông báo cho người dùng biết họ gặp lỗi hay thông báo gì?
function thongBao(text, type) {
    var n = noty({
        text        : text,
        type        : type,
        dismissQueue: true,
        closeWith   : ['click', 'backdrop', 'hover', 'button'],
        modal       : false,
        layout      : 'topLeft',
        theme       : 'relax',
        maxVisible  : 10,
        timeout: 200,
        animation: {
            open: 'animated bounceInUp', // Animate.css class names
            close: 'animated bounceOutRight', // Animate.css class names
            easing: 'swing', // unavailable - no need
            speed: 500 // unavailable - no need
        }
    });
}