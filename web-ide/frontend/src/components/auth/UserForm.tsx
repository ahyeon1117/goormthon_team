import { ChangeEvent } from 'react';

type Props = {
  form: {
    username?: string;
    email: string;
    password: string;
  };
  isSignup?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  submitLabel: string;
};

const UserForm = ({ form, isSignup = false, onChange, onSubmit, submitLabel }: Props) => {
  return (
    <div className="md:w-1/2 bg-card-right text-white p-12 flex flex-col justify-center space-y-10">
      {isSignup && (
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="username"
            value={form.username || ''}
            onChange={onChange}
            className="w-full bg-transparent border-b border-white outline-none text-white"
          />
        </div>
      )}
      <div>
        <label className="block mb-1">Email (ID)</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          className="w-full bg-transparent border-b border-white outline-none text-white"
        />
      </div>
      <div>
        <label className="block mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          className="w-full bg-transparent border-b border-white outline-none text-white"
        />
      </div>
      <div>
        <button
          onClick={onSubmit}
          className="bg-btn-primary hover:bg-primary-hover font-semibold text-white px-6 py-2 rounded-lg"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default UserForm;
