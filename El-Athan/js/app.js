
//////////////////////////////////////////////////
function theCitiesList(){
    let cities = {
        BNS :{
            name: "بني سويف",
            classes:"BNS EG city"
        },
        cairo :{
            name: "القاهـــرة",
            classes:"Cairo EG city"
        },
        alex:{
            name: "الأسكندرية",
            classes: "ALX EG city"
        },
        FYM:{
            name: "الفيوم",
            classes: "Faiyum EG city"
        },
        GZ:{
            name: "الجيــــزة",
            classes: "GZ EG city"
        },
        SUZ:{
            name: "السويــس",
            classes: "SUZ EG city"
        },

        PTS:{
            name: "بورسعيد",
            classes: "PTS EG city"
        },

        SHG:{
            name: "سوهاج",
            classes: "SHG EG city"
        },
        SHR:{
            name: "الشرقيــة",
            classes: "SHR EG city"
        },
        WAD:{
            name: "الوادى الجديد",
            classes: "WAD EG city"
        },
        GH:{
            name: "الغربيــة",
            classes: "GH EG city"
        },
        ASN:{
            name: "أســوان",
            classes: "ASN EG city"
        },
        DK:{
            name: "الدقهلية",
            classes: "DK EG city"
        },
        BH:{
            name: "البحيرة",
            classes: "BH EG city"
        },
        IS:{
            name: "الاسماعيلية",
            classes: "IS EG city"
        },
    }

    for(key in cities){
        var listCont = document.getElementById("theList");
        listCont.innerHTML += `<li class='${cities[key].classes}'>${cities[key].name}</li>`

    }
}
theCitiesList()
/////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// Changing the city name in the title bar by clicking the navbar
//////////////////////////////////////////////////////////////////
let eles = document.querySelectorAll(".city");
for(let i = 0; i < eles.length; i++){
    eles[i].addEventListener("click", ()=>{
        document.querySelector('.big-name h2').textContent = eles[i].textContent;
        
        var city = eles[i].classList[0],
        country = eles[i].classList[1];
        getTimes(city, country)
    })
}
///////////////////////////////////
function clearThings (str){
    let newstring = str.split("");
    let result = "";
    for(let i = 0; i < newstring.length; i++){
        if(newstring[i] === ":"){
            result += newstring[i]
        }
        if(!isNaN(newstring[i])){
            result += newstring[i]
        }
    }
    return result
}
////////////////////////////////////
/////////////////////////////////////////////
// Translating the numbers into arabic 
/////////////////////////////////////////////
function toArabic(engNumbers){
    let nums = {
        "0":"۰", "1":"١", "2":"٢", "3":"٣", "4":"٤", 
        "5":"٥", "6":"٦", "7":"٧", "8":"٨", "9":"٩"
    }
    let result = new String();
    var toArray = engNumbers.split("")
    for(let i = 0; i < toArray.length; i++){
        let single = toArray[i];
        if(nums.hasOwnProperty(single)){
            result += nums[single];
        }
        if( single === ":"){
            result += single;
        }
    }
    return result;
}
/////////////////////////////////////////////////////////
function convertToArabicFormula(englishFormula) {
    let nums = {
      "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤",
      "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩"
    };
    let months = {
      "Jan": "يناير", "Feb": "فبراير", "Mar": "مارس", "Apr": "أبريل", "May": "مايو", "Jun": "يونيو",
      "Jul": "يوليو", "Aug": "أغسطس", "Sep": "سبتمبر", "Oct": "أكتوبر", "Nov": "نوفمبر", "Dec": "ديسمبر"
    };
    let parts = englishFormula.split(" ");

    // Convert numbers
    for (let i = 0; i < parts.length; i++) {
        let part = parts[i];
        let converted = "";
        for (let j = 0; j < part.length; j++) {
            let char = part[j];
            nums.hasOwnProperty(char) ? converted += nums[char] : converted += char;
        }
      parts[i] = converted;
    }

    // Convert month names
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i];
      months.hasOwnProperty(part) ? parts[i] = months[part] : false;
    }
    return parts.join(" ");
}
///////////////////////////////////////////
function getTimes (city, country) {
    let history = new Date();
    let month = history.getMonth() + 1;
    let year = history.getFullYear();
    let day = history.getDate();

    axios
    .get(`http://api.aladhan.com/v1/calendarByCity`,{
        params:{
            year: year,
            month: month,
            city:city,
            country,country
        }
    })
    .then(response=>{
        let ourTimes = response.data.data[day + 1].timings;
        let finalDate = response.data.data[day - 1].date.readable;
        document.querySelector(".big-name p").textContent = convertToArabicFormula(finalDate)

        let finalData = {
            "الفجر" :  ourTimes.Fajr,
            "الظهر" :  ourTimes.Dhuhr,
            "العصر" :  ourTimes.Asr,
            "المغرب" : ourTimes.Maghrib,
            "العشاء" : ourTimes.Isha
        }

        // console.log(finalData.الظهر)
        const container = document.getElementById("times");
        container.innerHTML = "";
        for(key in finalData){
            let card = `
                <div class="card">
                    <h4 class="time-name">${key}</h4>
                    ${ amPmClock(clearThings( finalData[key]))}
                </div>
            `;
            container.innerHTML += card
            console.log( card)
        }
    })
}
////////////////////////////////////////////////////////
function amPmClock(time){
    
    let x = time.split(":");
    let clearedTime = clearThings(x[0]);
    let prayTime;
    let amOrpm;
    let finalTime = parseInt(clearedTime);

    if(finalTime == 0){
        prayTime = 12;
        amOrpm = "صباحاً"
    }

    if(finalTime > 0 && finalTime <= 11){
        prayTime = finalTime;
        amOrpm = "صباحاً"        
    }
    if(finalTime == 12){
        prayTime = finalTime;
        amOrpm = "مساءاً"
    }
    if(finalTime > 12){
        prayTime = finalTime - 12;
        amOrpm = "مساءاً"
    }

    let markUp = `
        <div>
            <p class="timing">${prayTime}:${x[1]}</p>
            <p class='amPM'>${amOrpm}</p>
        </div>
    
    `;

    return markUp;
}