import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Combosslider = () => {
    const { combos, addToCart, currency } = useContext(ShopContext);
    const [displayCombos, setDisplayCombos] = useState([]);

    useEffect(() => {
        // Take first 5 combos or all if less than 5
        setDisplayCombos(combos.slice(0, 5));
    }, [combos]);

    const handleAddToCart = (combo) => {
        try {
            addToCart(combo, "combo");
            // toast.success(`${combo.name} added to cart!`);
        } catch (error) {
            toast.error("Failed to add combo to cart");
            console.error(error);
        }
    };

    return (
        <div className="w-full bg-[#FEF0E1] mx-auto sm:px-16 px-6 py-10">
            <div className="space-y-3 max-w-7xl mx-auto">
                <h2 className="sm:text-5xl text-3xl font-bold text-gray-800 text-center mb-6">
                    Featured Combos
                </h2>
                <div className="text-center">
                    <p className="text-gray-800 text-sm">
                        Our Most-Loved Bundles—Tried, Tested, and Trusted!
                    </p>
                    <p className="text-gray-800 text-sm">
                        Curated combinations our customers love.
                    </p>
                </div>
            </div>

            {/* Swiper for Combos */}
            <div className="relative mt-8 max-w-7xl mx-auto">
                <Swiper
                    modules={[Navigation]}
                    slidesPerView={2}
                    spaceBetween={10}
                    navigation={true}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                    className="pb-10"
                >
                    {displayCombos.map((combo) => (
                        <SwiperSlide key={combo._id}>
                            <div className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                                {/* Combo Image */}
                                <div className="relative overflow-hidden rounded-t-lg aspect-square">
                                    <Link to={`/combos/${combo._id}`}>
                                        <img
                                            src={
                                                combo.thumbImg
                                                    ? `https://ishmiherbal.com/uploads/thumbImg/${combo.thumbImg}`
                                                    : "/placeholder.jpg"
                                            }
                                            alt={combo.name}
                                            className="w-full rounded-lg  cursor-pointer relative  object-cover shadow-md   !overflow-hidden hover:scale-105 transition-all duration-300"
                                            onError={(e) => {
                                                e.target.src = "/placeholder.jpg";
                                            }}
                                        />
                                        {combo.discountedprice < combo.actualprice && (
                                            <span className="absolute top-2 left-2 bg-red-500 text-white sm:text-sm text-[8px] font-bold px-3 py-1 rounded-full">
                                                {Math.round(
                                                    ((combo.actualprice - combo.discountedprice)) / combo.actualprice * 100
                                                )}

                                                % OFF
                                            </span>
                                        )}
                                    </Link>
                                </div>

                                {/* Combo Details */}
                                <div className="p-3 flex flex-col items-center">
                                    <h3 className="text-xl font-semibold text-gray-900 text-center truncate max-w-full">
                                        {combo.name}
                                    </h3>

                                    {/* <p className="text-gray-600 text-sm text-center mt-2 line-clamp-2">
                                        {combo.shortDescription?.replace(/<[^>]*>/g, "") ||
                                            "Special curated combo"}
                                    </p> */}

                                    {/* Prices */}
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="text-lg font-bold text-red-600">
                                            {currency} {combo.discountedprice}
                                        </span>
                                        {combo.discountedprice < combo.actualprice && (
                                            <span className="text-sm text-gray-400 line-through">
                                                {currency} {combo.actualprice}
                                            </span>
                                        )}
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => handleAddToCart(combo)}
                                        className="mt-2 w-full bg-[#8f6943] hover:bg-[#a78767] text-white py-2 rounded-md font-medium transition-colors"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* View All Combos Button */}
            {combos.length > 5 && (
                <div className="flex justify-center pt-5">
                    <Link to="/combos">
                        <button className="px-8 py-2.5 font-medium text-white bg-[#8f6943] hover:bg-[#a78767] rounded-lg transition-colors">
                            VIEW ALL COMBOS
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Combosslider;