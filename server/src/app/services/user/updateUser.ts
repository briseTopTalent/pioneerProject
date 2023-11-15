const { User } = require('../../models');
const { hashSync } = require('bcryptjs');

interface UserRecord {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  title?: string;
}

export const UpdateUser = async (
  id: number,
  firstName: string | null,
  lastName: string | null,
  phoneNumber: string | null,
  email: string | null,
  title: string | null
) => {
  const user = await User.findOne({ where: { id: id } });
  if (!user) {
    return { error: true, message: `User doesn't exist.` };
  }
  let obj: UserRecord = {};
  if(email !== null){
    obj.email = email
  }
  if (firstName !== null) {
    obj.first_name = firstName;
  }
  if (lastName !== null) {
    obj.last_name = lastName;
  }
  if (phoneNumber !== null) {
    obj.phone_number = phoneNumber;
  }
  if (title !== null) {
    obj.title = title
  }
  await user.update(obj);
  return { error: false, message: 'User details updated successfully.' };
};
