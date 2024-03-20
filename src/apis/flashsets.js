import axios from 'axios'

export function getMyFlashsets({ page, perPage, q, type }) {
    const params = {
        page,
        perPage,
        search: q === '' ? null : q,
        type: type === 'all' ? null : type,
    }
    return axios({
        url: `/api/flashsets/me`,
        params: params,
        method: 'GET',
    }).then(res => res.data)
}

export function getMyFlashsetsAll({ page, perPage, q, type, role }) {
    const params = {
        page,
        perPage,
        search: q === '' ? null : q,
        type: type === 'all' ? null : type,
        role,
    }

    return axios({
        url: `/api/flashsets`,
        params: params,
        method: 'GET',
    }).then(res => res.data)
}

export function flashsetsDistributed(body) {
    return axios({
        url: `/api/flashsets/distributed`,
        data: body,
        method: 'POST',
    }).then(res => res.data)
}

export function getTeacherDistributed(flashet_id) {
    return axios({
        url: `/api/flashsets/distributed/users?flashset_id=${flashet_id}`,
        method: 'GET',
    }).then(res => res.data)
}

export function getFlashsets({ page, perPage, params }) {
    return axios({
        url: `/api/flashsets?page=${page}&perPage=${perPage}`,
        method: 'GET',
        params,
    }).then(res => res.data)
}

export function getFlashcards({ id, page, perPage }) {
    return axios({
        url: `/api/flashsets/${id}/cards?page=${page}&perPage=${perPage}`,
        method: 'GET',
    }).then(res => res.data)
}
export function getFlashcardsByRole({ page, perPage, filter_role, search_name, category }) {
    const newcategory = category === 'all' ? '' : category
    return axios({
        url: `/api/flashsets/role/`,
        params: {
            page,
            perPage,
            filter_role,
            search_name,
            category: newcategory,
        },
        method: 'GET',
    }).then(res => res.data)
}
export function getFlashsetById(id, courseId) {
    return axios({
        url: `/api/flashsets/${id}`,
        params: {
            courseId,
        },
        method: 'GET',
    }).then(res => res.data)
}

export function getFlashsetExceptId({ id, page, perPage, search_name, type = '' }) {
    return axios({
        url: `/api/flashsets/except/${id}/creator/?page=${page}&perPage=${perPage}&q=${search_name}&type=${type}`,
        method: 'GET',
    }).then(res => res.data)
}

export function create(data) {
    return axios({
        url: `/api/flashsets`,
        data,
        method: 'POST',
    }).then(res => res.data)
}
export function update(id, data) {
    return axios({
        url: `/api/flashsets/${id}`,
        data,
        method: 'PUT',
    }).then(res => res.data)
}
export function del(id) {
    return axios({
        url: `/api/flashsets/${id}`,
        method: 'DELETE',
    }).then(res => res.data)
}
export function learn(id, flashcards) {
    return axios({
        url: `/api/flashsets/${id}/learn`,
        data: { flashcards },
        method: 'POST',
    }).then(res => res.data)
}
export function countdown(id, flashcards) {
    return axios({
        url: `/api/flashsets/${id}/countdown`,
        data: { flashcards },
        method: 'POST',
    }).then(res => res.data)
}
export function histories(id, type, flashcards, courseId) {
    return axios({
        url: `/api/flashsets/${id}/histories`,
        params: {
            courseId,
        },
        data: { flashcards, type },
        method: 'POST',
    }).then(res => res.data)
}

export function deleteCardInHistories({ flashsetId, flashcardId, courseId, type }) {
    return axios({
        url: `/api/flashsets/${flashsetId}/histories`,
        data: { flashsetId, flashcardId, courseId, type },
        method: 'DELETE',
    }).then(res => res.data)
}
