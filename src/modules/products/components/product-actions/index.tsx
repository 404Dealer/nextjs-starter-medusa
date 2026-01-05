"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import AppointmentPicker from "@modules/booking/components/appointment-picker"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

interface AppointmentSelection {
  date: string
  time: string
  endTime: string
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [appointment, setAppointment] = useState<AppointmentSelection | null>(null)
  const countryCode = useParams().countryCode as string

  // Check if this product is bookable (has is_bookable metadata)
  const isBookable = useMemo(() => {
    const metadata = product.metadata as Record<string, unknown> | undefined
    return metadata?.is_bookable === true || metadata?.is_bookable === "true"
  }, [product.metadata])

  // Get booking configuration from product metadata
  const bookingConfig = useMemo(() => {
    const metadata = product.metadata as Record<string, unknown> | undefined
    return {
      blockMinutes: (metadata?.block_minutes as number) || 60,
      slotIncrement: (metadata?.slot_increment as number) || 15,
    }
  }, [product.metadata])

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // Handle appointment slot selection
  const handleSelectSlot = (date: string, time: string, endTime: string) => {
    setAppointment({ date, time, endTime })
  }

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    // For bookable products, require appointment selection
    if (isBookable && !appointment) return null

    setIsAdding(true)

    // Build metadata for bookable products
    const metadata = isBookable && appointment
      ? {
          appointment_date: appointment.date,
          appointment_time: appointment.time,
          block_minutes: bookingConfig.blockMinutes,
        }
      : undefined

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
      metadata,
    })

    // Reset appointment selection after adding
    if (isBookable) {
      setAppointment(null)
    }

    setIsAdding(false)
  }

  // Check if add to cart should be disabled
  const isAddToCartDisabled = useMemo(() => {
    if (!inStock || !selectedVariant || disabled || isAdding || !isValidVariant) {
      return true
    }
    // For bookable products, require appointment selection
    if (isBookable && !appointment) {
      return true
    }
    return false
  }, [inStock, selectedVariant, disabled, isAdding, isValidVariant, isBookable, appointment])

  // Determine button text
  const getButtonText = () => {
    if (!selectedVariant && !options) {
      return "Select variant"
    }
    if (!inStock || !isValidVariant) {
      return "Out of stock"
    }
    if (isBookable && !appointment) {
      return "Select appointment time"
    }
    return isBookable ? "Book Appointment" : "Add to cart"
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        {/* Show appointment picker for bookable products */}
        {isBookable && selectedVariant && (
          <>
            <Divider />
            <div className="py-2">
              <AppointmentPicker
                blockMinutes={bookingConfig.blockMinutes}
                slotIncrement={bookingConfig.slotIncrement}
                onSelectSlot={handleSelectSlot}
                selectedDate={appointment?.date}
                selectedTime={appointment?.time}
                disabled={!!disabled || isAdding}
              />
            </div>
            <Divider />
          </>
        )}

        <Button
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled}
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {getButtonText()}
        </Button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
