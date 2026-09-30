// صندوق فاضي جاهز لمكان إعلان - يبقى مخفي تمامًا لحد ما نحط فيه كود AdSense بعد القبول.
// عشان تفعّليه بعدين: امسحي data-empty="true" وحطي كود <ins class="adsbygoogle">...</ins> جوه الـ div.
export default function AdSlot({ id }) {
  return (
    <div className="ad-slot" data-empty="true" data-slot-id={id}>
      {/* AdSense code goes here */}
    </div>
  );
}
 
