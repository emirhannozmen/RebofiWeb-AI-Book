import { useForm, Controller } from 'react-hook-form';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BookForm({ onSubmit, initialValues, isLoading, submitLabel }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: initialValues || {}
  });
  const { t } = useLanguage();
  const label = submitLabel || t('form_save');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-800 text-white p-6 rounded shadow-lg border border-gray-700 font-serif">
      {/* Title */}
      <div>
        <label className="block mb-1 font-medium text-gray-300">{t('form_title')}</label>
        <input {...register("title", { required: t('form_req_title') })} className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        {errors.title && <span className="text-red-400 text-sm">{errors.title.message}</span>}
      </div>
      
      {/* Author */}
      <div>
        <label className="block mb-1 font-medium text-gray-300">{t('form_author')}</label>
        <input {...register("author", { required: t('form_req_author') })} className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        {errors.author && <span className="text-red-400 text-sm">{errors.author.message}</span>}
      </div>

      {/* Publisher */}
      <div>
        <label className="block mb-1 font-medium text-gray-300">{t('form_publisher')}</label>
        <input {...register("publisher")} className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      {/* ISBN */}
      <div>
        <label className="block mb-1 font-medium text-gray-300">{t('form_isbn')}</label>
        <input {...register("isbn")} className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      {/* Publication Year */}
      <div>
        <label className="block mb-1 font-medium text-gray-300">{t('form_pub_year')}</label>
        <input 
          type="number" 
          {...register("publication_date", { 
            valueAsNumber: true,
            min: { value: 1000, message: "Invalid year" },
            max: { value: new Date().getFullYear() + 5, message: "Invalid year" }
          })} 
          className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
          placeholder="YYYY"
        />
        {errors.publication_date && <span className="text-red-400 text-sm">{errors.publication_date.message}</span>}
      </div>

      {/* Status & Rating */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-gray-300">{t('form_status')}</label>
          <select {...register("reading_status")} className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="want_to_read">{t('status_want')}</option>
            <option value="reading">{t('status_reading')}</option>
            <option value="completed">{t('status_completed')}</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-300">{t('form_rating')}</label>
          <input type="number" min="1" max="5" {...register("personal_rating")} className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>
      
      {/* Notes */}
      <div>
        <label className="block mb-1 font-medium text-gray-300">{t('form_notes')}</label>
        <textarea {...register("personal_notes")} className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none" rows="3"></textarea>
      </div>

      {/* Image Upload */}
      <div>
         <label className="block mb-1 font-medium text-gray-300">{t('form_cover')}</label>
         <Controller
            control={control}
            name="image"
            render={({ field: { onChange, onBlur, value } }) => (
              <input 
                type="file" 
                onChange={(e) => onChange(e.target.files[0])} 
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white file:bg-blue-600 file:text-white file:border-none file:rounded file:px-2 file:py-1 file:mr-2 file:hover:bg-blue-700 cursor-pointer"
                accept="image/*"
              />
            )}
          />
      </div>

      <button disabled={isLoading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
        {isLoading ? t('form_saving') : label}
      </button>
    </form>
  );
}
