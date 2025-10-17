<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CanadaPostService
{
    protected $username;
    protected $password;
    protected $customerNumber;

    public function __construct()
    {
        $this->username = config('canadapost.username');
        $this->password = config('canadapost.password');
        $this->customerNumber = config('canadapost.customer_number');
    }

    public function getRates(array $origin, array $destination, array $parcel)
    {
        $url = "https://ct.soa-gw.canadapost.ca/rs/ship/price";

        $xml = view('xml.canadapost_rate', compact('origin','destination','parcel'))->render();

        $response = Http::withBasicAuth($this->username, $this->password)
            ->withHeaders([
                'Accept' => 'application/vnd.cpc.ship.rate-v4+xml',
                'Content-Type' => 'application/vnd.cpc.ship.rate-v4+xml',
            ])
            ->withBody($xml, 'application/xml')
            ->post($url);

        if ($response->failed()) {
            throw new \Exception("Canada Post API error: " . $response->body());
        }

        // Parse XML
        $rates = simplexml_load_string($response->body());

        $options = [];
        foreach ($rates->{'price-quotes'}->{'price-quote'} as $quote) {
            $options[] = [
                'service' => (string)$quote->{'service-code'},
                'name'    => (string)$quote->{'service-name'},
                'price'   => (float)$quote->{'price-details'}->{'due'},
                'delivery' => (string)$quote->{'service-standard'}->{'expected-transit-time'},
            ];
        }

        usort($options, fn($a,$b) => $a['price'] <=> $b['price']);

        return array_slice($options, 0, 5);
    }
}
