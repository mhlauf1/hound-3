import {SanityImage, type WrapperProps} from 'sanity-image'

import {dataset, projectId} from '@/sanity/lib/api'

const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/`

const Image = <T extends React.ElementType = 'img'>(props: WrapperProps<T>) => {
  const {queryParams, ...rest} = props as any
  return (
    <SanityImage
      baseUrl={baseUrl}
      {...rest}
      queryParams={{auto: 'format', ...queryParams}}
    />
  )
}

export default Image
