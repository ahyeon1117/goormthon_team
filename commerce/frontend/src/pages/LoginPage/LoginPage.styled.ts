import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
  position: relative;
`;

export const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
`;

export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.3;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #e896ff;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #E896FF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;

  &:hover {
    background-color: #d95cfb;
  }
`;

export const SignupLink = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;

  a {
    color: #E896FF;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: none;
  border: none;
  color: #E896FF;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`;

export const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.8rem;
  margin: 5px 0 0;
  text-align: left;
`;
