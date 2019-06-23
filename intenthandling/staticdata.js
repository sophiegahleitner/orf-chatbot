

export function getRecordWinner(compId, discId, genId, locId, number = 5) {
    return new Promise((resolve, reject) => {
        axios.get(url + '/best?CompetitionId=' + compId + '&DisciplineId=' + discId + '&GenderId=' + genId + '&LocationId=' + locId + '&TopItems=' + number)
            .then(resp => resolve(resp))
            .catch(resp => reject(resp));
    })
}

