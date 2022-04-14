import moment from 'moment'

const listBulan = ['Januari', 'Februrari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const generateZeroPaddedNumber = (value) => {
  let pad = '00'
  return (pad + value).slice(-pad.length)
}

const generateFormattedTime = (time) => {
  return generateZeroPaddedNumber(time.hour()) + "." + generateZeroPaddedNumber(time.minute())
}

export const generateURL = (url) => {
  return url?.toLowerCase()?.replace(/ /g, "-")?.replace(/[^A-Z0-9]+/ig, "")
}

export const validateURL = (url) => {
  const re = /^[a-zA-Z0-9-_]+$/;
  return re.test(String(url).toLowerCase());
}

export default {
  generateURL: generateURL,
  validateURL: validateURL,
  moneyFormatter: function (nominal) {

    let initialString = nominal + "";
    let fullString = ""

    let counter = 0;

    for (let i = initialString.length - 1; i >= 0; i--) {
      fullString = initialString.charAt(i) + (counter % 3 === 0 && counter > 0 ? "." : "") + fullString
      counter++;
    }

    return fullString
  },

  createInitial: function (name) {

    if (!name) {
      return ""
    }

    let words = name.split(" ")
    let initial = ""

    for (let w of words) {
      initial += w[0];
      if (initial.length >= 2) break;
    }

    return initial

  },

  validateEmail: (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },

  processEmailTemplate: (replacer, emailTemplate) => {
    let oldTemplate = emailTemplate
    do {
      oldTemplate = emailTemplate
      for (let key in replacer) {
        emailTemplate = emailTemplate.replace(`%${key}%`, replacer[key])
      }
    } while (emailTemplate !== oldTemplate)

    return emailTemplate
  },

  generateDateTimeIndonesianString: (startTime, endTime) => {
    startTime = new Date(startTime)
    endTime = new Date(endTime)
    let momentStart = moment(startTime).utcOffset('+0700')
    let momentEnd = moment(endTime).utcOffset('+0700')
    let date = startTime.getDate()
    let month = listBulan[startTime.getMonth()]
    let year = startTime.getFullYear()


    let startTimeStr = generateFormattedTime(momentStart)
    let endTimeStr = generateFormattedTime(momentEnd)
    let allStr = `${date} ${month} ${year} pukul ${startTimeStr} - ${endTimeStr} WIB`
    return allStr
  },

  getAttachmentURL: (urlString) => {

    if (urlString) {
      console.log("INI URL STRING",urlString)
      let splits = urlString.split("/")
      if (splits.length > 0) {
        return splits[splits.length - 1]
      } else {
        return null
      }
    }

    return null

  },

  zeroPadder: (number, size, prefix) => {

    let numberString = number + ""

    while (numberString.length < size) {
      numberString = "0" + numberString
    }

    if (prefix) {
      return prefix + numberString
    } else {
      return numberString
    }
  },

  truncateText : (textToCut, maxLength) =>{

    if(textToCut){
      if(textToCut.length < maxLength){
        return textToCut
      }else {

        if(!textToCut.substring){
          return textToCut
        }

        return textToCut.substring(0,maxLength) + "..."
      }
    }else{
      return ""
    }
  }

};
