import React, { useState, useEffect } from "react";
import CategoryFilterPills from "./CategoryFilterPills";
import useCategories from "@/hooks/customer/useCategories";
import { useCategoryProducts } from "@/hooks/customer/useCategoryProducts";
import ItemCard from "./ItemCard";
import { NoResults } from "@/components/ui/no-results";
import { Product } from "@/types/customer/product.types";

type Category = {
  id: number;
  name?: string;
  title?: string;
  children?: Category[];
};

export default function PopularServiceCategory() {
  const { data: categories, isLoading: isCategoriesLoading } =
    useCategories("services");
  const mainCategories: Category[] = React.useMemo(
    () =>
      categories && Array.isArray(categories) && categories.length > 0
        ? (categories as Category[])
        : [],
    [categories]
  );

  const [active, setActive] = useState<string>("");
  const [activeSub, setActiveSub] = useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (mainCategories.length > 0 && !active) {
      setActive(mainCategories[0].name || mainCategories[0].title || "");
    }
  }, [mainCategories, active]);

  const subCategories: Category[] = React.useMemo(() => {
    const selectedMain = mainCategories.find(
      (cat) => (cat.name || cat.title) === active
    );
    return selectedMain?.children || [];
  }, [mainCategories, active]);

  useEffect(() => {
    if (subCategories.length > 0) {
      setActiveSub(subCategories[0].name || subCategories[0].title || "");
      setSelectedSubCategoryId(subCategories[0].id);
    } else {
      setActiveSub("");
      setSelectedSubCategoryId(null);
    }
  }, [active, subCategories]);

  // Only fetch services when a subcategory is selected
  const {
    data: serviceData,
    isLoading: isServiceLoading,
    error: serviceError,
  } = useCategoryProducts(selectedSubCategoryId || "");

  const handleSubCategoryChange = (subCategoryName: string) => {
    setActiveSub(subCategoryName);
    const selectedSub = subCategories.find(
      (cat) => (cat.name || cat.title) === subCategoryName
    );
    setSelectedSubCategoryId(selectedSub?.id || null);
  };

  return (
    <section className="my-8 md:my-12">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6">
        Popular Service Category
      </h2>
      {/* Main Category Pills */}
      <div className="flex gap-2 md:gap-3 flex-nowrap overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide -mx-4 md:mx-0 px-4 md:px-0">
        {isCategoriesLoading ? (
          <div className="text-gray-400">Loading categories...</div>
        ) : mainCategories.length === 0 ? (
          <div className="text-gray-400">No categories found.</div>
        ) : (
          <CategoryFilterPills
            categories={mainCategories.map(
              (cat) => cat.name || cat.title || ""
            )}
            active={active}
            setActive={setActive}
          />
        )}
      </div>
      {/* Subcategory Pills */}
      {subCategories.length > 0 && (
        <div className="flex gap-2 md:gap-3 mb-6 md:mb-8 flex-nowrap overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide -mx-4 md:mx-0 px-4 md:px-0">
          <CategoryFilterPills
            categories={subCategories.map((cat) => cat.name || cat.title || "")}
            active={activeSub}
            setActive={handleSubCategoryChange}
          />
        </div>
      )}

      {/* Services Display - Only show when a subcategory is selected */}
      {selectedSubCategoryId && (
        <div className="mt-6 md:mt-8">
          {isServiceLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 animate-pulse rounded-lg h-48 md:h-60"
                ></div>
              ))}
            </div>
          ) : serviceError ? (
            <div className="text-center text-red-500">
              Error loading services. Please try again later.
            </div>
          ) : serviceData && serviceData.products?.data ? (
            serviceData.products.data.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {serviceData.products.data.map((service: Product) => (
                  <ItemCard
                    key={service.id}
                    item={service}
                    hasButton={true}
                    categoryName={activeSub}
                    displayRegular={false}
                  />
                ))}
              </div>
            ) : (
              <NoResults
                title="No services found"
                message={`We couldn't find any services in the "${activeSub}" category.`}
                icon="🔧"
                showGoBack={false}
                showBrowseAll={true}
                browseAllText="Browse All Categories"
              />
            )
          ) : null}
        </div>
      )}
    </section>
  );
}
