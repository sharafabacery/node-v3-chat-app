const genrateMessage = (text,username='Admin') => {
    return {
        text,
        username,
        createdAt: new Date().getTime()
    }
}
const genrateLocationMessage = (position,username) => {
    return {
        url: `https://google.com/maps?q=${position.latitude},${position.longitude}`,
        createdAt: new Date().getTime(),
        username
    }
}

module.exports = {
    genrateMessage,
    genrateLocationMessage
}