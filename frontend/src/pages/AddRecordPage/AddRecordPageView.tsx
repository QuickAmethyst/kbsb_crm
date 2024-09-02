import { AddRecordPageQuery, FieldDataType } from "@/__generated__/graphql";
import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Divider from "@/components/Divider";
import NumericTextField from "@/components/NumericTextField";
import PicklistField from "@/components/PicklistField";
import Space from "@/components/Space";
import Text from "@/components/Text";
import TextField from "@/components/TextField";
import DefaultTemplate from "@/templates/DefaultTemplate";
import routes from "@/utils/routes";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

export type AddRecordPageViewValues = Record<string, unknown>;
export type AddRecordPageSubmitHandler = (values: AddRecordPageViewValues) => void;
export type AddRecordPageViewProps = {
  object?: AddRecordPageQuery['objects']['data'][number],
  fields: AddRecordPageQuery['fields']
  onValid: AddRecordPageSubmitHandler;
}

export default function AddRecordPageView({ object, fields, onValid }: AddRecordPageViewProps) {
  const { register, control, formState: { errors }, handleSubmit } = useForm();
  
  const renderField = (f: AddRecordPageQuery['fields'][number]) => {
    if (f.dataType === FieldDataType.String) {
      return (
        <TextField
          {...register(f.label, {
            ...(f.isRequired && { required: `${f.label} is required`}),
            setValueAs: (str) => {
              if (!!!str) return null;
              return str;
            }
          })}
          key={f.id}
          label={f.label}
          required={f.isRequired}
          defaultValue={f.defaultValue || ''}
          error={!!errors[f.label]}
          helperText={errors[f.label]?.message as string}
        />
      )
    }

    if (f.dataType === FieldDataType.Number) {
      return (
        <NumericTextField
          {...register(f.label, {
            ...(f.isRequired && { required: `${f.label} is required`}),
            setValueAs: (str) => {
              if (!!!str) return null;
              return str;
            }
          })}
          key={f.id}
          label={f.label}
          required={f.isRequired}
          defaultValue={f.defaultValue || ''}
          error={!!errors[f.label]}
          helperText={errors[f.label]?.message as string}
        />
      )
    }

    if (f.dataType === FieldDataType.Date) {
      return (
        <Controller
          control={control}
          name={f.label}
          rules={{
            ...(f.isRequired && { required: `${f.label} is required` })
          }}
          render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
            <DatePicker
              {...field}
              mode='single'
              selected={value}
              style={{ width: '100%' }}
              onSelect={onChange}
              renderInput={(inputProps) => (
                <TextField
                  {...inputProps}
                  fullWidth
                  label={f.label}
                  autoComplete='off'
                  error={!!error}
                  required={f.isRequired}
                  helperText={error?.message}
                />
              )}
            />
          )}
        />
      )
    }

    if (f.dataType === FieldDataType.Picklist) {
      return (
        <PicklistField
          {...register(f.label, {
            ...(f.isRequired && { required: `${f.label} is required`}),
            setValueAs: (str) => {
              if (!!!str) return null;
              return str;
            }
          })}
          fieldID={f.id}
          key={f.id}
          required={f.isRequired}
          defaultValue={f.defaultValue || ''}
          label={f.label}
          TextFieldProps={{
            error: !!errors[f.label],
            required: f.isRequired,
            helperText: errors[f.label]?.message as string,
          }}
        />
      )
    }

    return <Text color='red'>Unsupported Field</Text>;
  }

  return (
    <DefaultTemplate>
      <div className='container'>
        <div className='wrapper'>
          <Space fullWidth size={24} direction='vertical'>
            <Text size={24} weight={600}>New {object?.name} Record</Text>

            <Divider />

            <Space as='form' fullWidth direction="vertical" onSubmit={handleSubmit(onValid)}>
              {fields.map((f) => renderField(f))}

              <Space size={[12, 0]}>
                <Link passHref legacyBehavior href={routes.dashboard.objects.detail(object?.id).index}>
                  <Button variant='outlined' color='secondary'>Back</Button>
                </Link>
                <Button type='submit'>Submit</Button>
              </Space>
            </Space>
          </Space>
        </div>
      </div>

      <style jsx>
        {`
          .container {
            padding: 64px 0;
            display: flex;
            justify-content: center;
          }

          .wrapper {
            width: 60%;
            max-width: 1148px;
          }
        `}
      </style>
    </DefaultTemplate>
  )
}