interface IUser
{
    id: string;
    username: string;
    password: string;
    token: string;
    inviteCode: string;
    accountCreationDate: Date;
}

export default IUser;