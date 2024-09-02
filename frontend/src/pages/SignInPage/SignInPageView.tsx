import Button from "@/components/Button";
import Select from "@/components/Select";
import Space from "@/components/Space";
import DefaultTemplate from "@/templates/DefaultTemplate";
import { SubmitHandler, useForm } from "react-hook-form";

export type SignInPageViewValues = {
  organizationID: number;
}

export type SignInPageValidHandler = SubmitHandler<SignInPageViewValues>;
export type SignInPageViewProps = {
  onValid: SignInPageValidHandler;
}

export default function SignInPageView({
  onValid
}: SignInPageViewProps) {
  const { register, formState: { errors }, handleSubmit } = useForm<SignInPageViewValues>();

  return (
    <DefaultTemplate>
      <div className="container">
        
        <div className='wrapper'>
          <Space as='form' size={[0, 24]} direction='vertical' onSubmit={handleSubmit(onValid)}>
            <Select
              {...register('organizationID', { required: 'Choose Organization' })}
              placeholder="Select organization"
              TextFieldProps={{
                error: !!errors.organizationID,
                helperText: errors.organizationID?.message,
              }}
            >
              <Select.Option value={1}>Acme Inc</Select.Option>
              <Select.Option value={2}>Blue Sky Inc (Data is Empty)</Select.Option>
            </Select>

            <Button fullWidth type="submit">Sign In</Button>
          </Space>
        </div>

        <style jsx>
          {`
            .container {
              width: 100vw;
              height: calc(100vh - 60px);
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .wrapper {
            }
          `}
        </style>
      </div>
    </DefaultTemplate>
  )
}