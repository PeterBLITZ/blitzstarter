import crypto from 'crypto';

const hex = len => crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);

export default { hex };
