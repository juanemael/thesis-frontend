import ApiRequest from '../util/ApiRequest'

export default class Activity {
  create = async (body) => {
    return await ApiRequest.set('v1/class', 'POST', body)
  }

  getAll = async () => {
    return await ApiRequest.set('v1/classes', 'GET')
  }

  getById = async (activity_id) => {
    return await ApiRequest.set(`v1/class/${activity_id}`, 'GET')
  }

  update = async (activity_id, body) => {
    return await ApiRequest.set(`v1/class/${activity_id}`, 'PUT', body)
  }

  delete = async (activity_id) => {
    return await ApiRequest.set(`v1/class/${activity_id}`, 'DELETE')
  }

  getClassParticipants = async (activity_id) => {
    return await ApiRequest.set(`v1/member_class/${activity_id}`, 'GET')
  }

  uploadCertificateUrl = async (class_code, participant_id, certificate) => {
    let formData = new FormData()

    console.log('upload result', `v1/certificate/${participant_id}`)

    formData.append('upload', certificate, certificate.name)

    return await ApiRequest.setMultipart(
      `v1/certificate/${participant_id}`,
      'POST',
      formData,
    )
  }

  inviteOneMemberToClass = async (code, email, full_name) => {
    return await ApiRequest.set(`v1/class/${code}/invite`, 'POST', [
        {
          email,
          full_name
        }
      ]
    )
  }

  inviteBatchMemberToClass = async (code, userInfoArray) => {
    return await ApiRequest.set(`v1/class/${code}/invite`, 'POST', {
      userInfoArray : userInfoArray
    })
  }
  updateNote = async (activity_id,body) => {
    return await ApiRequest.set(`v1/member_class/${activity_id}`,"PUT",body)
  }
}
