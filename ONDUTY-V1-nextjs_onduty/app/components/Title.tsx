interface titleProp {
 title: string;
}

const Title = ({title}: titleProp) => {
  return (
    <div className='flex m-5 font-semibold text-2xl text-(--color-primary)'>
      {title}
    </div>
  )
}

export default Title