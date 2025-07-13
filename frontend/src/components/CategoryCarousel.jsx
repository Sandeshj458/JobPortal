import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchedQuery } from '@/redux/jobSlice'

const category = [
    "Frontend Developer",
    "Backend Engineer",
    "Data Scientist",
    "UX Designer",
    "FullStack Developer",
    "Cloud Engineer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        // Navigate with query as URL param
        navigate(`/browse?query=${encodeURIComponent(query)}`);
    }

    return (
        <div className="w-full px-6 sm:px-10 md:px-14 mt-8 mb-14 relative">
            <div>
                <Carousel className='w-full max-w-xl mx-auto my-20'>
                    <CarouselContent className="gap-x-2 sm:gap-x-4 md:gap-x-6 pl-4 pr-4">
                        {
                            category.map((cat, index) => (
                                <CarouselItem
                                    key={index}  // Add key prop
                                    className='basis-[70%] sm:basis-[45%] md:basis-1/3 flex justify-center'  // fixed typo here: lg-basis -> lg:basis
                                >
                                    <Button onClick={() => searchJobHandler(cat)} variant='outline' className='rounded-full bg-white'>
                                        {cat}
                                    </Button>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent >

                    <CarouselPrevious
                        className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 text-white rounded-full p-2 shadow-md transition hover:brightness-110"
                        style={{ backgroundColor: '#6d3ac2' }}
                    />
                    <CarouselNext
                        className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 text-white rounded-full p-2 shadow-md transition hover:brightness-110"
                        style={{ backgroundColor: '#6d3ac2' }}
                    />

                </Carousel>
            </div>
        </div>
    )
}

export default CategoryCarousel
