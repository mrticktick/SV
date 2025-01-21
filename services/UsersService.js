
class UserService {

    async userUpdate(email, refreshToken) {
        const updateUser = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                refreshToken: refreshToken,
            },
        })

    }

}

module.exports = UserService
