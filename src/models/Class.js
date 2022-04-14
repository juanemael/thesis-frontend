import ApiRequest from '../util/ApiRequest'

export default class Class {
  invite = async (code, user) => {
    return await ApiRequest.set(`/v1/class/${code}/invite`, 'POST', [user])
  }

  inviteBatch = async (code, users) => {
    return await ApiRequest.set(`/v1/class/${code}/invite`, 'POST', users)
  }

  getAll = async () => {
    return await ApiRequest.set('/v1/class', 'GET')
  }

  getFeedbacks = async (code) => {
    return await ApiRequest.set(`/v1/class/${code}/feedbacks`, 'GET')
  }

  updateFeedback = async (id, body) => {
    return await ApiRequest.set(`/v1/feedbacks/${id}`, 'PUT', body)
  }

  getFeedbackMetrics = async () => {
    return await ApiRequest.set(`/v1/dashboard/feedback_data`, 'GET')
  }

  getPrivateClassFeedbacks = async () => {
    return await ApiRequest.set(`/v1/dashboard/private-class-feedbacks`, 'GET')
  }

  updateFeedbackNote = async (feedbackId, feedbackNote) => {
    return await ApiRequest.set(`/v1/participant/feedback/${feedbackId}/note`, 'PUT', {
      note: feedbackNote,
    })
  }

  getByCode = async (code) => {
    return await ApiRequest.set(`/v1/class/${code}`, 'GET')
  }

  createNew = async (classBody) => {
    return await ApiRequest.set('/v1/class', 'POST', classBody)
  }

  update = async (code, body) => {
    return await ApiRequest.set(`/v1/class/${code}`, 'PUT', body)
  }

  updateQuestionShowingStatus = async (code, newStatus) => {
    console.log(newStatus)

    return await ApiRequest.set(`/v1/class/${code}`, 'PUT', {
      show_answers_to_user: newStatus,
    })
  }

  updateClassImage = async (code, image) => {
    let formData = new FormData()

    formData.append('upload', image, image.name)

    if (code) {
      return await ApiRequest.setMultipart(`/v1/class/${code}/upload_image`, 'POST', formData)
    } else {
      return await ApiRequest.setMultipart(`/v1/class/upload_image`, 'POST', formData)
    }
  }

  delete = async (code) => {
    return await ApiRequest.set(`/v1/class/${code}`, 'DELETE')
  }

  undelete = async (code) => {
    return await ApiRequest.set(`/v1/class/${code}/toggle`, 'PUT')
  }

  getClassParticipant = async (code) => {
    return await ApiRequest.set(`/v1/class/${code}/participants`, 'GET')
  }

  updateNote = async (code, note) => {
    return await ApiRequest.set(`/v1/class/${code}/note`, 'PUT', { note })
  }

  hardDelete = async (code) => {
    return await ApiRequest.set(`/v1/class/${code}/hard`, 'DELETE')
  }

  updatePriceBatch = async (ids, price) => {
    return await ApiRequest.set(`/v1/class/update_batch_price`, 'POST', {
      ids: ids,
      price: price,
    })
  }

  uploadCertificateTemplate = async (code, body, page) => {
    return await ApiRequest.setMultipart(
      `/v1/class/${code}/custom_certificate_template/${page}`,
      'POST',
      body,
    )
  }

  uploadVideo = async (file, setProgress) => {
    let formData = new FormData()

    // console.log('blob', file)
    formData.append('upload', file, file.name)

    return await ApiRequest.setMultipartWithProgress(
      `/v1/class/uploadVideo`,
      'POST',
      formData,
      setProgress,
    )
  }
}
